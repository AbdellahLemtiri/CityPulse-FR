import { useState } from "react";
import axiosClient from "../config/axios-client";
// --- MOCK DATA ---
const mockSectors = [
  { id: 1, name: "Quartier Plateau" },
  { id: 2, name: "Ville Nouvelle" },
  { id: 3, name: "Hay Salam" },
  { id: 4, name: "Sidi Bouzid" },
];

const mockStaff = [
  {
    id: 1,
    first_name: "Hassan",
    last_name: "Alami",
    email: "hassan.manager@safipulse.ma",
    role: "Manager",
    sector_id: 1,
    sector_name: "Quartier Plateau",
    is_active: true,
  },
  {
    id: 2,
    first_name: "Kamal",
    last_name: "Radi",
    email: "kamal.presse@safipulse.ma",
    role: "Journaliste",
    sector_id: null,
    sector_name: "-",
    is_active: true,
  },
  {
    id: 3,
    first_name: "Nadia",
    last_name: "Fathi",
    email: "nadia.manager@safipulse.ma",
    role: "Manager",
    sector_id: 2,
    sector_name: "Ville Nouvelle",
    is_active: false,
  },
];

export default function AdminStaff() {
  const [staffList, setStaffList] = useState(mockStaff);

  // STATES DU FORMULAIRE ET MODAL
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    id: null,
    first_name: "",
    last_name: "",
    email: "",
    password: "", // Utilisé uniquement à la création
    role: "Manager", // Par défaut
    sector_id: "", // Obligatoire si Manager
  });

  // OUVIR MODAL (Création)
  const handleOpenCreate = () => {
    setFormData({
      id: null,
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      role: "Manager",
      sector_id: "",
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  // OUVRIR MODAL (Modification)
  // SOUMETTRE LE FORMULAIRE
  const handleSubmit = async (e) => {
    // Étape 1 : async
    e.preventDefault();

    // Validation front-end rapide
    if (formData.role === "Manager" && !formData.sector_id) {
      alert("Veuillez assigner un secteur au Manager.");
      return;
    }

    // Étape 2 : Préparation
    setIsSubmitting(true);
    setErrors({}); // Kan-ms7ou l-erreurs l-9dam

    // Étape 3 : try / catch
    try {
      if (isEditing) {
        // Logic dial l-Modification (PUT) n-kheliwha mn be3d
        alert("Modification en cours de dev...");
      } else {
        // Étape 4 : L-Appel API (POST)
        // Kan-tsennaw Laravel y-jawebna b response
        const response = await axiosClient.post("/admin/staff", formData);

        // Étape 5 : Mise à jour de l-UI (Succès)
        const sectorName =
          formData.role === "Manager"? mockSectors.find((s) => s.id === parseInt(formData.sector_id))?.name: "-";

        // Hna f l-idéal, Laravel khass y-sift lik l-User l-jdid b ID dialo f response.data.user
        // Walakin bima anaka glti li rjje3ti ghir 'message', ghadi n-saybouh localement:
        const newStaff = response.data.user;

        setStaffList([newStaff, ...staffList]); // N-zidouh f tableau
        alert(response.data.message); // L-message li ja mn Laravel
      }

      setIsModalOpen(false); // N-sddou l-modal
      // N-khewiw l-formulaire
      setFormData({
        id: null,
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        role_id: 2,
        sector_id: "",
      });
    } catch (error) {
      // Étape 6 : Gestion des Erreurs
      if (error.response && error.response.status === 422) {
        // 422 Unprocessable Entity = Erreurs de validation Laravel
        setErrors(error.response.data.errors);
      } else {
        console.log(error);
        alert("Erreur Serveur: Impossible de contacter le Backend.");
      }
    } finally {
      setIsSubmitting(false); // Kan-7iydou l-Loading f ga3 l-7alat
    }
  };
  // SOUMETTRE LE FORMULAIRE
   

  // ACTIVER / DÉSACTIVER UN COMPTE (Soft Ban)
  const toggleStatus = (id) => {
    if (
      window.confirm("Voulez-vous vraiment modifier le statut de cet accès ?")
    ) {
      setStaffList(
        staffList.map((s) =>
          s.id === id ? { ...s, is_active: !s.is_active } : s,
        ),
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* HEADER DE LA PAGE */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">
            Gestion du Staff (RBAC)
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Créez et gérez les accès des Managers et Journalistes.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 uppercase text-sm shadow-sm transition-colors flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">
            person_add
          </span>
          Nouveau Compte
        </button>
      </div>

      {/* TABLEAU ADMINISTRATIF */}
      <div className="bg-white border border-gray-300 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300 text-xs text-gray-700 uppercase tracking-wider">
              <th className="p-3 border-r border-gray-200">Nom & Prénom</th>
              <th className="p-3 border-r border-gray-200">
                Email Professionnel
              </th>
              <th className="p-3 border-r border-gray-200">Rôle</th>
              <th className="p-3 border-r border-gray-200">Secteur (Scope)</th>
              <th className="p-3 border-r border-gray-200 text-center">
                Statut
              </th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((staff) => (
              <tr
                key={staff.id}
                className={`border-b border-gray-200 text-sm ${!staff.is_active ? "bg-red-50/50" : "hover:bg-gray-50"}`}>
                <td className="p-3 border-r border-gray-200 font-bold text-gray-900">
                  {staff.first_name} {staff.last_name}
                </td>
                <td className="p-3 border-r border-gray-200 text-gray-600">
                  {staff.email}
                </td>
                <td className="p-3 border-r border-gray-200">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold uppercase border ${
                      staff.role === "Manager"
                        ? "bg-purple-100 text-purple-700 border-purple-300"
                        : "bg-indigo-100 text-indigo-700 border-indigo-300"
                    }`}>
                    {staff.role}
                  </span>
                </td>
                <td className="p-3 border-r border-gray-200 font-bold text-gray-700">
                  {staff.sector_name}
                </td>
                <td className="p-3 border-r border-gray-200 text-center">
                  {staff.is_active ? (
                    <span className="text-green-600 font-bold uppercase text-[10px] bg-green-100 border border-green-300 px-2 py-1">
                      Actif
                    </span>
                  ) : (
                    <span className="text-red-600 font-bold uppercase text-[10px] bg-red-100 border border-red-300 px-2 py-1">
                      Inactif
                    </span>
                  )}
                </td>
                <td className="p-3 text-center flex justify-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(staff)}
                    className="text-blue-600 hover:text-blue-800 font-bold text-xs uppercase">
                    Éditer
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={() => toggleStatus(staff.id)}
                    className={`${staff.is_active ? "text-red-600 hover:text-red-800" : "text-green-600 hover:text-green-800"} font-bold text-xs uppercase`}>
                    {staff.is_active ? "Bloquer" : "Activer"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ========================================== */}
      {/* MODAL DU FORMULAIRE COMPLET (Création / Edition) */}
      {/* ========================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white border border-gray-400 w-full max-w-2xl flex flex-col shadow-2xl">
            {/* Header Modal */}
            <div className="bg-gray-800 p-4 border-b border-gray-900 flex justify-between items-center text-white">
              <h3 className="font-bold uppercase text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">
                  manage_accounts
                </span>
                {isEditing
                  ? "Modifier les accès du membre"
                  : "Créer un nouveau compte Staff"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="hover:text-gray-300 font-bold px-2">
                X
              </button>
            </div>

            {/* Body Modal (Le Formulaire) */}
            <form
              onSubmit={handleSubmit}
              className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Prénom */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.first_name}
                    onChange={(e) =>
                      setFormData({ ...formData, first_name: e.target.value })
                    }
                    className="w-full border border-gray-300 p-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500"
                    placeholder="Ex: Hassan"
                  />
                </div>
                {/* Nom */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Nom de famille *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.last_name}
                    onChange={(e) =>
                      setFormData({ ...formData, last_name: e.target.value })
                    }
                    className="w-full border border-gray-300 p-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500"
                    placeholder="Ex: Alami"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Email Professionnel *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full border border-gray-300 p-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500"
                    placeholder="nom@safipulse.ma"
                  />
                </div>
                {/* Mot de passe */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Mot de passe{" "}
                    {isEditing && "(Laisser vide pour ne pas modifier)"}{" "}
                    {!isEditing && "*"}
                  </label>
                  <input
                    type="password"
                    required={!isEditing} // Obligatoire seulement à la création
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full border border-gray-300 p-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500"
                    placeholder="********"
                  />
                </div>
              </div>

              <hr className="my-6 border-gray-200" />

              {/* RÔLE ET SECTEUR */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Choix du Rôle */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Rôle Système *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        role: e.target.value,
                        sector_id:
                          e.target.value === "Journaliste"
                            ? ""
                            : formData.sector_id,
                      });
                    }}
                    className="w-full border border-gray-300 p-2 text-sm bg-white focus:outline-none focus:border-blue-500">
                    <option value="Manager">
                      Manager (Opérateur de secteur)
                    </option>
                    <option value="Journaliste">Journaliste (Narrateur)</option>
                  </select>
                </div>

                {/* Choix du Secteur (Scope Géographique) - Conditionnel */}
                <div
                  className={`transition-opacity ${formData.role === "Manager" ? "opacity-100" : "opacity-30 pointer-events-none"}`}>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Secteur Assigné {formData.role === "Manager" && "*"}
                  </label>
                  <select
                    value={formData.sector_id}
                    onChange={(e) =>
                      setFormData({ ...formData, sector_id: e.target.value })
                    }
                    disabled={formData.role !== "Manager"}
                    className="w-full border border-gray-300 p-2 text-sm bg-white focus:outline-none focus:border-blue-500">
                    <option value="">-- Sélectionner un secteur --</option>
                    {mockSectors.map((s) => (
                      <option
                        key={s.id}
                        value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  {formData.role === "Journaliste" && (
                    <p className="text-[10px] text-gray-500 mt-1 italic">
                      Un journaliste a un accès global à la ville.
                    </p>
                  )}
                </div>
              </div>

              {/* Footer Form (Boutons) */}
              <div className="flex gap-3 mt-8 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 border border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 uppercase text-sm">
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 uppercase text-sm disabled:opacity-50">
                  {isSubmitting ? "Enregistrement..." : "Sauvegarder le compte"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
