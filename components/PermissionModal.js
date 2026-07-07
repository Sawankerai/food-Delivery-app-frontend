import { useState } from "react";

const permissionModules = [
  { key: "users", label: "User Management", icon: "👥", description: "Manage users, roles and access" },
  { key: "content", label: "Content", icon: "📝", description: "Create, edit and delete content" },
  { key: "analytics", label: "Analytics", icon: "📊", description: "View performance reports" },
  { key: "settings", label: "Settings", icon: "⚙️", description: "Manage app configuration" },
  { key: "billing", label: "Billing", icon: "💳", description: "View and manage billing info" },
];

const permissionTypes = ["view", "edit", "delete"];

const Toggle = ({ checked, onChange, color = "violet" }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={onChange}
    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${
      checked ? "bg-violet-600" : "bg-gray-200"
    }`}
  >
    <span
      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${
        checked ? "translate-x-5" : "translate-x-1"
      }`}
    />
  </button>
);

export default function PermissionModal({ user, onClose, onSave }) {
  const [permissions, setPermissions] = useState(
    user?.permissions || {
      users: { view: true, edit: false, delete: false },
      content: { view: true, edit: true, delete: false },
      analytics: { view: true, edit: false, delete: false },
      settings: { view: false, edit: false, delete: false },
      billing: { view: false, edit: false, delete: false },
    }
  );
  const [activeRole, setActiveRole] = useState("custom");
  const [saving, setSaving] = useState(false);

  const roles = [
    { id: "admin", label: "Admin", color: "bg-red-100 text-red-700" },
    { id: "editor", label: "Editor", color: "bg-blue-100 text-blue-700" },
    { id: "viewer", label: "Viewer", color: "bg-green-100 text-green-700" },
    { id: "custom", label: "Custom", color: "bg-violet-100 text-violet-700" },
  ];

  const applyRole = (role) => {
    setActiveRole(role);
    const presets = {
      admin: Object.fromEntries(permissionModules.map((m) => [m.key, { view: true, edit: true, delete: true }])),
      editor: Object.fromEntries(permissionModules.map((m) => [m.key, { view: true, edit: m.key !== "billing", delete: false }])),
      viewer: Object.fromEntries(permissionModules.map((m) => [m.key, { view: true, edit: false, delete: false }])),
    };
    if (presets[role]) setPermissions(presets[role]);
  };

  const togglePermission = (module, type) => {
    setActiveRole("custom");
    setPermissions((prev) => ({
      ...prev,
      [module]: { ...prev[module], [type]: !prev[module][type] },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    onSave(permissions);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="font-display font-bold text-xl text-gray-900">Account Permissions</h2>
            <p className="text-sm text-gray-400 font-body mt-0.5">
              Manage access levels for{" "}
              <span className="text-violet-600 font-medium">{user?.name || "this account"}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Role Presets */}
        <div className="px-6 py-4 border-b border-gray-50">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-3 font-body font-medium">Quick Role Presets</p>
          <div className="flex gap-2 flex-wrap">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => applyRole(role.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium font-body transition-all ${
                  activeRole === role.id
                    ? `${role.color} ring-2 ring-offset-1 ring-violet-400`
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>
        </div>

        {/* Permissions Table */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-1">
            {/* Column headers */}
            <div className="flex items-center px-3 pb-2">
              <div className="flex-1 text-xs text-gray-400 uppercase tracking-wider font-body font-medium">Module</div>
              {permissionTypes.map((type) => (
                <div key={type} className="w-20 text-center text-xs text-gray-400 uppercase tracking-wider font-body font-medium">
                  {type}
                </div>
              ))}
            </div>

            {permissionModules.map((module, i) => (
              <div
                key={module.key}
                className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="flex-1 flex items-center gap-3">
                  <span className="text-xl">{module.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-800 font-body">{module.label}</p>
                    <p className="text-xs text-gray-400 font-body">{module.description}</p>
                  </div>
                </div>
                {permissionTypes.map((type) => (
                  <div key={type} className="w-20 flex justify-center">
                    <Toggle
                      checked={permissions[module.key]?.[type] || false}
                      onChange={() => togglePermission(module.key, type)}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Permission Summary */}
        <div className="px-6 py-3 bg-violet-50 mx-6 mb-2 rounded-xl">
          <p className="text-xs text-violet-600 font-body font-medium">
            Active permissions:{" "}
            {Object.values(permissions)
              .flatMap(Object.values)
              .filter(Boolean).length}{" "}
            / {permissionModules.length * 3} total
          </p>
          <div className="mt-1 h-1.5 bg-violet-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-violet-600 rounded-full transition-all duration-300"
              style={{
                width: `${
                  (Object.values(permissions).flatMap(Object.values).filter(Boolean).length /
                    (permissionModules.length * 3)) *
                  100
                }%`,
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 pt-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 font-body rounded-xl hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium font-body rounded-xl shadow-lg shadow-violet-200 hover:shadow-violet-300 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Saving...
              </span>
            ) : (
              "Save Permissions"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
