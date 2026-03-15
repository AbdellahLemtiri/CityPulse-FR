import { useState } from "react";

export default function JournalisteEditor() {
  // States dial l-Article
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "Culture", // US.59
    scope: "global",     // US.57
    sector_id: "",       // Ila kan local
    status: "draft"      // US.58
  });
  
  const [coverImage, setCoverImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // US.56: Image de couverture
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAction = (statusTarget) => {
    if (!formData.title || !formData.content) {
      alert("Veuillez remplir le titre et le contenu de l'article.");
      return;
    }
    
    setIsSubmitting(true);
    
    // Hna ghadi t-koun l'API: axiosClient.post('/articles', {...formData, status: statusTarget})
    
    setTimeout(() => {
      alert(`Article ${statusTarget === 'published' ? 'PUBLIÉ' : 'SAUVEGARDÉ COMME BROUILLON'} avec succès !`);
      
      // Reset
      setFormData({ title: "", content: "", category: "Culture", scope: "global", sector_id: "", status: "draft" });
      setCoverImage(null);
      setPreviewUrl(null);
      document.getElementById('cover-upload').value = "";
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto">
      
      {/* --- COLONNE GAUCHE : RÉDACTION (US.56) --- */}
      <div className="w-full lg:w-2/3 flex flex-col gap-4">
        
        {/* Cover Image Upload */}
        <div className="bg-white border border-gray-300 p-4 shadow-sm">
          <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Image de Couverture (Optionnelle)</label>
          {previewUrl ? (
            <div className="relative h-48 w-full bg-gray-100 border border-gray-300">
              <img src={previewUrl} alt="Cover" className="w-full h-full object-cover" />
              <button 
                onClick={() => {setCoverImage(null); setPreviewUrl(null); document.getElementById('cover-upload').value="";}}
                className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs font-bold"
              >
                Retirer
              </button>
            </div>
          ) : (
            <div 
              onClick={() => document.getElementById('cover-upload').click()}
              className="h-32 w-full border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 flex flex-col items-center justify-center cursor-pointer text-gray-500"
            >
              <span className="material-symbols-outlined text-3xl mb-1">add_photo_alternate</span>
              <span className="text-sm font-bold">Ajouter une image haute résolution</span>
            </div>
          )}
          <input type="file" id="cover-upload" accept="image/*" className="hidden" onChange={handleImageChange} />
        </div>

        {/* Titre et Contenu */}
        <div className="bg-white border border-gray-300 p-4 shadow-sm flex-1 flex flex-col">
          <input 
            type="text" 
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="Saisissez le titre de l'article ici..."
            className="w-full text-xl font-bold border-b border-gray-300 pb-3 mb-4 outline-none placeholder-gray-400"
          />
          
          <textarea 
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            placeholder="Rédigez le contenu de votre article ici..."
            className="w-full flex-1 min-h-[400px] border-none outline-none resize-none text-gray-800 leading-relaxed"
          ></textarea>
        </div>
      </div>

      {/* --- COLONNE DROITE : PARAMÈTRES (US.57, US.58, US.59) --- */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6">
        
        {/* Catégorisation */}
        <div className="bg-white border border-gray-300 p-4 shadow-sm">
          <h3 className="text-sm font-bold text-gray-800 uppercase mb-3 border-b border-gray-200 pb-2">Catégorisation</h3>
          <select 
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="w-full border border-gray-300 p-2 text-sm bg-gray-50 outline-none focus:border-secondary-500"
          >
            <option value="Culture">Culture & Patrimoine</option>
            <option value="Sport">Sport & Loisirs</option>
            <option value="Santé">Santé & Bien-être</option>
            <option value="Urgence">Urgence & Sécurité</option>
            <option value="Institutionnel">Actualité Institutionnelle</option>
          </select>
        </div>

        {/* Ciblage d'Audience (Scope Isolation) */}
        <div className="bg-white border border-gray-300 p-4 shadow-sm">
          <h3 className="text-sm font-bold text-gray-800 uppercase mb-3 border-b border-gray-200 pb-2">Audience Cible</h3>
          
          <div className="space-y-3">
            <label className="flex items-start gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="scope" 
                value="global"
                checked={formData.scope === 'global'}
                onChange={() => setFormData({...formData, scope: 'global', sector_id: ''})}
                className="mt-1"
              />
              <div>
                <p className="text-sm font-bold text-gray-800">Global (Toute la ville)</p>
                <p className="text-xs text-gray-500">L'article apparaîtra sur le fil d'actualité de tous les citoyens de Safi.</p>
              </div>
            </label>

            <label className="flex items-start gap-2 cursor-pointer mt-2">
              <input 
                type="radio" 
                name="scope" 
                value="local"
                checked={formData.scope === 'local'}
                onChange={() => setFormData({...formData, scope: 'local'})}
                className="mt-1"
              />
              <div>
                <p className="text-sm font-bold text-gray-800">Local (Quartier spécifique)</p>
                <p className="text-xs text-gray-500">Seuls les résidents du secteur choisi recevront une notification.</p>
              </div>
            </label>

            {formData.scope === 'local' && (
              <select 
                value={formData.sector_id}
                onChange={(e) => setFormData({...formData, sector_id: e.target.value})}
                className="w-full border border-gray-300 p-2 text-sm bg-gray-50 outline-none mt-2"
              >
                <option value="">-- Sélectionnez un secteur --</option>
                <option value="1">Quartier Plateau</option>
                <option value="2">Ville Nouvelle</option>
                <option value="3">Hay Salam</option>
                <option value="4">Sidi Bouzid</option>
              </select>
            )}
          </div>
        </div>

        {/* Actions (Workflow) */}
        <div className="bg-white border border-gray-300 p-4 shadow-sm">
          <h3 className="text-sm font-bold text-gray-800 uppercase mb-3 border-b border-gray-200 pb-2">Publication</h3>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => handleAction('draft')}
              disabled={isSubmitting}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 text-sm uppercase transition-colors"
            >
              Enregistrer (Brouillon)
            </button>
            <button 
              onClick={() => handleAction('published')}
              disabled={isSubmitting}
              className="w-full bg-secondary-600 hover:bg-secondary-700 text-white font-bold py-2 text-sm uppercase transition-colors"
            >
              Publier l'Article
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}