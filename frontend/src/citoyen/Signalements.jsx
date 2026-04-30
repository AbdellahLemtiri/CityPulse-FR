import { useState, useEffect } from 'react';
import axiosClient from '../config/axios-client';
import toast, { Toaster } from 'react-hot-toast';
import { ImageDown, Compass, CircleStop, Mic, SendHorizontal, LocateFixed, MapPin, Eye } from 'lucide-react';
import { useReactMediaRecorder } from 'react-media-recorder';

export default function Signalements() {
  const [incidents, setIncidents] = useState([]);
  const [tab, setTab] = useState('mesSignalements');
  const [etapForm, setEtapForm] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoding, setIsLoding] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState(null);
  const [images, setImages] = useState([]);

  const { status, startRecording, stopRecording, mediaBlobUrl, clearBlobUrl } = useReactMediaRecorder({ audio: true, blobPropertyBag: { type: 'audio/webm' } });
  useEffect(() => {
    console.log('Recorder Status:', status);
  }, [status]);
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > 4) {
      toast.error('Vous ne pouvez télécharger que 4 images maximum.');
      return;
    }

    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
  };
  // useEffect(() => {
  //   return () => {
  //      images.forEach((img) => URL.revokeObjectURL(img.url));
  //   };
  // }, []);
  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setAddress('Position GPS détectée ');
          toast.success('Position GPS récupérée ');
        },
        (error) => {
          toast.error("Erreur de géolocalisation. Veuillez écrire l'adresse.");
        },
      );
    }
  };

  const fetchIncidents = async () => {
    setIsLoding(true);
    setTab('null');
    try {
      const response = await axiosClient.get('/incidents');
      let data = response.data.data ?? [];
      setIncidents(data);
    } catch (error) {
      console.error(error);
      setIncidents([]);
    } finally {
      setTab('mesSignalements');
      setIsLoding(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      if (location) {
        formData.append('latitude', location.lat);
        formData.append('longitude', location.lng);
      }
      formData.append('address', address);
      images.forEach((img) => {
        formData.append('images[]', img.file);
        // console.log(img.file instanceof File);
      });

      if (mediaBlobUrl) {
        const audioBlob = await fetch(mediaBlobUrl).then((r) => r.blob());
        formData.append('audio', audioBlob, 'record.webm');
      }

      const response = await axiosClient.post('/incidents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const newIncident = response.data.data;

      setIncidents([newIncident, ...incidents]);
      resetForm();
      setTab('mesSignalements');

      toast.success('Incident signalé avec succès !');
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'envoi du signalement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setImages([]);
    setAddress('');
    setLocation(null);
    clearBlobUrl();
    setEtapForm(1);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-500', icon: '', text: 'En attente' };
      case 'validated':
        return { color: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-500', icon: '', text: 'En cours' };
      case 'resolved':
        return { color: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-500', icon: '', text: 'Résolu' };
      case 'rejected':
        return { color: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-500', icon: '', text: 'Rejeté' };
      default:
        return { color: 'bg-gray-100 text-gray-700', icon: '', text: status };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  console.log(address);
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-0 pb-24 md:pb-8">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex justify-between items-center gap-4 mb-4 border-b border-gray-200 dark:border-gray-700">
        <div className=" pb-5">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{tab === 'mesSignalements' ? 'Mes Signalements' : 'Signaler un problème'}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Aidez-nous à améliorer Safi en signalant les anomalies.</p>
        </div>

        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 mt-4">
          {!isLoding && (
            <button
              onClick={() => {
                resetForm();
                setTab('crationTab');
              }}
              className="bg-primary-600 hover:bg-primary-500 text-white font-bold py-2 px-4 rounded-xl  transition-colors flex items-center justify-center gap-2 active:scale-95">
              <Compass /> signaler{' '}
            </button>
          )}
        </div>
      </div>{' '}
      {isLoding && (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      )}
      {tab === 'mesSignalements' && (
        <>
          {incidents.length === 0 && (
            <div className="flex justify-center py-10">
              <span className="text-gray-500 dark:text-gray-400">Aucun signalement pour le moment.</span>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 md:gap-6">
            {incidents.map((incident) => {
              const badge = getStatusBadge(incident.status);
              return (
                <div key={incident.id} className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                  <div className="flex h-full">
                    <div className="w-1/3 bg-gray-100 dark:bg-gray-900 relative overflow-hidden">
                      {incident.images && incident.images.length > 0 ? (
                        <img src={` ${incident.images[0]}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Incident" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600">
                          <span className="material-symbols-outlined text-4xl">broken_image</span>
                        </div>
                      )}
                    </div>
                    <div className="w-2/3 p-4 flex flex-col ">
                      <div className="flex justify-between  items-center mb-2">
                        <div className="flex items-center gap-1">
                          <span className="text-[13px ] text-gray-500 dark:text-gray-400"> REF :</span>
                          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{incident.ref_num}</span>
                        </div>

                        <div className="flex items-center flex-col gap-1">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 ${badge.color}`}>
                            <span className="material-symbols-outlined text-[12px]">{badge.icon}</span>
                            {badge.text}
                          </span>
                          <button
                            onClick={() => {
                              setSelectedIncident(incident);
                              setTab('detailTab');
                            }}
                            className="p-1.5   rounded-lg font-bold text-sm shadow-sm  flex items-center gap-2 bg-primary-600/95 text-white hover:bg-primary-500">
                            <Eye className="text-[10px]" /> detail
                          </button>
                        </div>
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm md:text-base leading-tight mb-1 line-clamp-1">{incident.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1 line-clamp-1">
                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                        {incident.address}
                      </p>
                      <div className="mt-auto flex justify-between items-center border-t border-gray-100 dark:border-gray-700 pt-3">
                        <span className="text-[11px] text-gray-500 dark:text-gray-400">Envoyer a : {incident.created_at}</span>

                        {incident.category ? <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-md">{incident.category}</span> : <span className="text-[10px] italic text-gray-400">Catégorie en attente</span>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
      {tab === 'crationTab' && (
        <>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 mt-4">
            <button
              onClick={() => {
                resetForm();
                setTab('mesSignalements');
              }}
              className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-3 px-6 rounded-xl  transition-colors flex items-center justify-center gap-2 active:scale-95">
              <span className="material-symbols-outlined">arrow_back</span>
              Retour
            </button>
          </div>

          <div className="flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden zoom-in flex flex-col">
              <div className="p-6 overflow-y-auto no-scrollbar flex-1 space-y-6">
                {etapForm === 1 && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Que se passe-t-il ? *</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-gray-100 dark:bg-gray-900 dark:text-white  border border-gray-50/50 focus:border-primary-200 dark:focus:border-primary-600  rounded-lg px-4 py-2 text-gray-900 dark:text-white outline-none resize-none" placeholder="Ex: Fuite d'eau, nid de poule..." />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Détails (Texte ou Audio) *</label>
                      <textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-gray-100 dark:bg-gray-900 dark:text-white  border border-gray-50/50 focus:border-primary-200 dark:focus:border-primary-600  rounded-lg px-4 py-2 text-gray-900 dark:text-white outline-none resize-none mb-3" placeholder="Détaillez le problème ici..."></textarea>

                      <div className="  bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 flex flex-col    gap-3">
                        {!mediaBlobUrl ? (
                          <>
                            <button type="button" onClick={status === 'recording' ? stopRecording : startRecording} className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${status === 'recording' ? 'bg-red-100 text-red-500 animate-pulse' : 'bg-primary-100 text-primary-500 hover:bg-primary-200'}`}>
                              <span className="  text-3xl">{status === 'recording' ? <CircleStop /> : <Mic />}</span>
                            </button>
                            <p className="text-sm text-gray-500">{status === 'recording' ? 'Enregistrement en cours...' : 'Cliquez pour enregistrer une note vocale'}</p>
                          </>
                        ) : (
                          <div className="w-full flex items-center gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                            <audio controls src={mediaBlobUrl} className="h-10 w-full" />
                            <button type="button" onClick={clearBlobUrl} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/20 p-2 rounded-md">
                              <span className="material-symbols-outlined">delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-end">
                      <button type="button" disabled={!title || (!description && !mediaBlobUrl)} onClick={() => setEtapForm(2)} className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold transition-colors disabled:opacity-50">
                        Suivant
                      </button>
                    </div>
                  </>
                )}

                {etapForm === 2 && (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 flex justify-between">
                        <span>Photos pour appuyer votre demande *</span>
                        <span className="text-gray-400 font-normal">{images.length}/4 max</span>
                      </label>

                      <div className="grid grid-cols-4 gap-3">
                        {images.map((img, index) => (
                          <div key={index} className="aspect-square relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 group">
                            <img src={img.url} className="w-full h-full object-cover" alt="Preview" />
                            <button type="button" onClick={() => removeImage(index)} className="absolute inset-0 bg-gary-100 text-white flex items-center justify-center opacity-10  transition-opacity">
                              <span className="material-symbols-outlined">delete</span>
                            </button>
                          </div>
                        ))}

                        {images.length < 4 && (
                          <div onClick={() => document.getElementById('incident-image-input').click()} className="  rounded-xl   hover:border-primary-500 dark:hover:border-primary-500 bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center cursor-pointer transition-colors text-gray-400 hover:text-primary-500">
                            <ImageDown className="w-10 h-20" />{' '}
                          </div>
                        )}
                      </div>
                      <input type="file" id="incident-image-input" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                      {images.length === 0 && <p className="text-red-500 text-xs mt-1">Au moins une photo est obligatoire.</p>}
                    </div>
                    <div>
                      <div className="flex flex-col  gap-2">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">détecter automatiquement l'adresse</label>
                        <div className="flex gap-2">
                          <input type="text" disabled value={location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : ''} className="flex-1 bg-gray-100 dark:bg-gray-900 border cursor-not-allowed border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" placeholder="automiquement" />
                          <button type="button" onClick={getLocation} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-4 rounded-xl transition-colors flex items-center justify-center" title="Détecter ma position GPS">
                            <LocateFixed />
                          </button>
                        </div>
                      </div>
                    </div>{' '}
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Où se trouve le problème ? *</label>
                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="flex-1 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Saisissez l'adresse ou le quartier..." />
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between gap-3">
                      <button type="button" onClick={() => setEtapForm(1)} className="px-6 py-2.5 rounded-xl font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        Précédent
                      </button>
                      <button type="button" onClick={handleSubmit} disabled={images.length === 0 || !title || (!description && !mediaBlobUrl) || (!address && !location) || isSubmitting} className="px-6 py-2.5 rounded-xl font-bold bg-primary-600 hover:bg-primary-500 text-white  transition-colors disabled:opacity-50 flex items-center gap-2">
                        {isSubmitting ? (
                          <div className="flex justify-center py-6">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-200"></div>
                          </div>
                        ) : (
                          'Envoyer'
                        )}
                        {!isSubmitting && <SendHorizontal />}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
      {selectedIncident && tab === 'detailTab' && (
        <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border flex flex-col flex-start border-gray-200 dark:border-gray-700 ">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-sm mb-2 mt-2 font-bold">
                REF NUM : <span className="text-sm mb-2 mt-2 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-md border border-gray-300 dark:border-gray-600">{selectedIncident.ref_num}</span>
              </span>
              <h2 className="text-2xl mt-2 font-bold">{selectedIncident.title}</h2>
            </div>
            <button
              onClick={() => {
                setTab('mesSignalements');
                setSelectedIncident(null);
              }}
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="my-8 p-4 bg-white dark:bg-gray-900 rounded-lg">
            <h3 className="text-sm font-bold text-gray-500 mb-4">Suivi de l'intervention :</h3>

            {selectedIncident.status === 'rejected' ? (
              <div className="flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-lg">
                <span className="material-symbols-outlined">cancel</span>
                <span className="font-bold">Incident rejeté par le responsable.</span>

                <span className="">Reject reason</span>
                <p className="text-xs">{selectedIncident.reject_reason}</p>
              </div>
            ) : (
              <div className="flex items-center w-full relative">
                <div className="flex flex-col items-center relative z-10 w-1/4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${selectedIncident.status ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <span className="material-symbols-outlined text-sm">check</span>
                  </div>
                  <p className="text-xs font-bold mt-2 text-center text-gray-700 dark:text-gray-300">Envoyé</p>
                </div>

                <div className={`absolute left-[12.5%] right-[62.5%] top-4 h-1 -z-0 ${selectedIncident.status === 'validated' || selectedIncident.status === 'in_progress' || selectedIncident.status === 'resolved' ? 'bg-green-500' : 'bg-gray-300'}`}></div>

                <div className="flex flex-col items-center relative z-10 w-1/4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${selectedIncident.status === 'validated' || selectedIncident.status === 'in_progress' || selectedIncident.status === 'resolved' ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <span className="material-symbols-outlined text-sm">fact_check</span>
                  </div>
                  <p className="text-xs font-bold mt-2 text-center text-gray-700 dark:text-gray-300">Validé</p>
                </div>

                <div className={`absolute left-[37.5%] right-[37.5%] top-4 h-1 -z-0 ${selectedIncident.status === 'in_progress' || selectedIncident.status === 'resolved' ? 'bg-green-500' : 'bg-gray-300'}`}></div>

                <div className="flex flex-col items-center relative z-10 w-1/4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${selectedIncident.status === 'in_progress' ? 'bg-orange-500 animate-pulse' : selectedIncident.status === 'resolved' ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <span className="material-symbols-outlined text-sm">engineering</span>
                  </div>
                  <p className="text-xs font-bold mt-2 text-center text-gray-700 dark:text-gray-300">En cours</p>
                </div>

                <div className={`absolute left-[62.5%] right-[12.5%] top-4 h-1 -z-0 ${selectedIncident.status === 'resolved' ? 'bg-green-500' : 'bg-gray-300'}`}></div>

                <div className="flex flex-col items-center relative z-10 w-1/4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${selectedIncident.status === 'resolved' ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <span className="material-symbols-outlined text-sm">done_all</span>
                  </div>
                  <p className="text-xs font-bold mt-2 text-center text-gray-700 dark:text-gray-300">Résolu</p>
                </div>
              </div>
            )}
          </div>

          <span className="flex border-b border-gray-200 dark:border-gray-700 pb-2 items-center gap-2 font-bold text-gray-700 mb-4 dark:text-gray-200">
            Signaler le : <span>{selectedIncident.created_at}</span>
          </span>

          <span className="flex items-center gap-2 font-bold text-gray-700 dark:text-gray-200">Description : </span>
          <p className="text-gray-700 dark:text-gray-300 mb-2">{selectedIncident.description}</p>

          {selectedIncident.adresse && (
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <span className="material-symbols-outlined text-sm">location_on</span>
              {selectedIncident.adresse}
            </div>
          )}

          <div className="flex gap-2 mb-4 grid grid-cols-3">{selectedIncident.images && selectedIncident.images.map((img, idx) => <img src={img} key={idx} alt="Preuve" className="w-40 h-40 object-cover rounded-lg border border-gray-200" />)}</div>

          {selectedIncident.audio && (
            <div className="flex flex-start items-center w-full mb-4">
              <audio controls className="bg-gray-100 dark:bg-gray-800 h-10 w-full max-w-md rounded-full">
                <source src={selectedIncident.audio} />
                Votre navigateur ne supporte pas l'audio.
              </audio>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
