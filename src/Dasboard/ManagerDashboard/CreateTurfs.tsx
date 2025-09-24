import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "../../api/axiosInstance";
import { toast } from "sonner";

type PricingRule = {
  dayType: string;
  startTime: string;
  endTime: string;
  pricePerSlot: string | number;
};

const PRESET_AMENITIES = [
  { key: "Floodlights", label: "Floodlights", icon: "⚡" },
  { key: "Parking", label: "Parking", icon: "🅿️" },
  { key: "Gallery", label: "Gallery", icon: "🖼️" },
  { key: "Changing Room", label: "Changing Room", icon: "🚻" },
  { key: "WiFi", label: "WiFi", icon: "📶" },
];

const CreateTurfs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    description: "",
    defaultPricePerSlot: "",
    startHour: "06:00",
    endHour: "23:00",
    images: [""],
    admins: [""],
    isActive: true,
    slug: "",
    pricingRules: [{ dayType: "", startTime: "06:00", endTime: "23:00", pricePerSlot: "" }],
  });

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post("/turfs", payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Turf created successfully!");
      setFormData({
        name: "",
        address: "",
        city: "",
        description: "",
        defaultPricePerSlot: "",
        startHour: "06:00",
        endHour: "23:00",
        images: [""],
        admins: [""],
        isActive: true,
        slug: "",
        pricingRules: [{ dayType: "", startTime: "06:00", endTime: "23:00", pricePerSlot: "" }],
      });
      setSelectedAmenities([]);
    },
    onError: (err: any) => {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to create turf!");
    },
  });

  // Generic input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  // Amenities
  const toggleAmenity = (key: string) => {
    setSelectedAmenities((s) =>
      s.includes(key) ? s.filter((k) => k !== key) : [...s, key]
    );
  };

  // Pricing rules
  const handleRuleChange = (index: number, field: keyof PricingRule, value: string) => {
    const updated = [...formData.pricingRules];
    (updated[index] as any)[field] = value;
    setFormData((s) => ({ ...s, pricingRules: updated }));
  };

  const addRule = () =>
    setFormData((s) => ({
      ...s,
      pricingRules: [...s.pricingRules, { dayType: "", startTime: "06:00", endTime: "23:00", pricePerSlot: "" }],
    }));

  const removeRule = (index: number) =>
    setFormData((s) => ({ ...s, pricingRules: s.pricingRules.filter((_, i) => i !== index) }));

  // Images
  const handleImageChange = (index: number, value: string) => {
    const updated = [...formData.images];
    updated[index] = value;
    setFormData((s) => ({ ...s, images: updated }));
  };
  const addImage = () => setFormData((s) => ({ ...s, images: [...s.images, ""] }));
  const removeImage = (index: number) =>
    setFormData((s) => ({ ...s, images: s.images.filter((_, i) => i !== index) }));

  // Admins
  const handleAdminChange = (index: number, value: string) => {
    const updated = [...formData.admins];
    updated[index] = value;
    setFormData((s) => ({ ...s, admins: updated }));
  };
  const addAdmin = () => setFormData((s) => ({ ...s, admins: [...s.admins, ""] }));
  const removeAdmin = (index: number) =>
    setFormData((s) => ({ ...s, admins: s.admins.filter((_, i) => i !== index) }));

  // Group pricing rules by dayType
  const groupPricingRules = () => {
    const grouped: any = {};
    formData.pricingRules.forEach((rule) => {
      if (!rule.dayType) return;
      if (!grouped[rule.dayType]) grouped[rule.dayType] = { dayType: rule.dayType, timeSlots: [] };
      grouped[rule.dayType].timeSlots.push({
        startTime: rule.startTime,
        endTime: rule.endTime,
        pricePerSlot: Number(rule.pricePerSlot),
      });
    });
    return Object.values(grouped);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      location: { address: formData.address, city: formData.city },
      description: formData.description,
      defaultPricePerSlot: Number(formData.defaultPricePerSlot) || 0,
      pricingRules: groupPricingRules(),
      operatingHours: { start: formData.startHour, end: formData.endHour },
      amenities: selectedAmenities,
      images: formData.images.filter(Boolean),
      admins: formData.admins.filter(Boolean).map((id) => ({ $oid: id })),
      isActive: formData.isActive,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-"),
    };
    mutation.mutate(payload);
  };

  return (
    <div className="min-h-screen flex justify-center bg-green-50 p-6">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Create New Turf</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Turf Name"
              className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-200"
              required
            />
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-200"
              required
            />
            <input
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
              className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-200"
              required
            />
            <input
              name="defaultPricePerSlot"
              value={formData.defaultPricePerSlot}
              onChange={handleChange}
              type="number"
              placeholder="Default Price Per Slot"
              className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-200"
              required
            />
          </div>

          {/* Operating Hours */}
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col">
              <span className="text-sm text-gray-600">Start Hour</span>
              <input
                type="time"
                name="startHour"
                value={formData.startHour}
                onChange={handleChange}
                className="p-2 border rounded-lg"
              />
            </label>
            <label className="flex flex-col">
              <span className="text-sm text-gray-600">End Hour</span>
              <input
                type="time"
                name="endHour"
                value={formData.endHour}
                onChange={handleChange}
                className="p-2 border rounded-lg"
              />
            </label>
          </div>

          {/* Description */}
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Description"
            className="w-full p-3 border rounded-lg"
            required
          />

          {/* Amenities */}
          <div>
            <h3 className="font-semibold mb-2">Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {PRESET_AMENITIES.map((a) => {
                const active = selectedAmenities.includes(a.key);
                return (
                  <button
                    key={a.key}
                    type="button"
                    onClick={() => toggleAmenity(a.key)}
                    className={`flex flex-col items-center gap-1 p-2 border rounded-lg transition ${
                      active ? "bg-emerald-50 border-emerald-400" : "border-gray-200 hover:shadow"
                    }`}
                  >
                    <div className="text-xl">{a.icon}</div>
                    <div className="text-sm">{a.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Images */}
          <div>
            <h3 className="font-semibold mb-2">Images (URLs)</h3>
            {formData.images.map((img, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={img}
                  onChange={(e) => handleImageChange(i, e.target.value)}
                  placeholder="https://..."
                  className="flex-1 p-2 border rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="px-3 bg-red-500 text-white rounded-lg"
                >
                  X
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addImage}
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              + Add Image
            </button>
          </div>

          {/* Admins */}
          <div>
            <h3 className="font-semibold mb-2">Admins</h3>
            {formData.admins.map((a, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={a}
                  onChange={(e) => handleAdminChange(i, e.target.value)}
                  placeholder="MongoDB ObjectID"
                  className="flex-1 p-2 border rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeAdmin(i)}
                  className="px-3 bg-red-500 text-white rounded-lg"
                >
                  X
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addAdmin}
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              + Add Admin
            </button>
          </div>

          {/* Pricing Rules */}
      <div>
  <h3 className="font-semibold mb-2">Pricing Rules</h3>
  {formData.pricingRules.map((rule, idx) => (
    <div key={idx} className="grid grid-cols-1 md:grid-cols-6 gap-2 items-center mb-2">
      
      {/* Day Type dropdown */}
      <select
        value={rule.dayType}
        onChange={(e) => handleRuleChange(idx, "dayType", e.target.value)}
        className="col-span-2 p-2 border rounded-lg"
      >
        <option value="">Select Day Type</option>
        <option value="sunday-thursday">Sunday-Thursday</option>
        <option value="friday-saturday">Friday-Saturday</option>
        <option value="all-days">All Days</option>
      </select>

      <input
        type="time"
        value={rule.startTime}
        onChange={(e) => handleRuleChange(idx, "startTime", e.target.value)}
        className="p-2 border rounded-lg"
      />
      <input
        type="time"
        value={rule.endTime}
        onChange={(e) => handleRuleChange(idx, "endTime", e.target.value)}
        className="p-2 border rounded-lg"
      />
      <input
        type="number"
        value={rule.pricePerSlot as any}
        onChange={(e) => handleRuleChange(idx, "pricePerSlot", e.target.value)}
        placeholder="Price"
        className="p-2 border rounded-lg"
      />
      <button
        type="button"
        onClick={() => removeRule(idx)}
        className="px-3 bg-red-500 text-white rounded-lg"
      >
        Remove
      </button>
    </div>
  ))}
  <button
    type="button"
    onClick={addRule}
    className="px-4 py-2 bg-green-600 text-white rounded-lg mt-2"
  >
    + Add Rule
  </button>
</div>


          {/* Slug & Active */}
          <div className="grid grid-cols-2 gap-4 items-center">
            <input
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="Slug (auto if empty)"
              className="p-2 border rounded-lg"
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={() =>
                  setFormData((s) => ({ ...s, isActive: !s.isActive }))
                }
              />
              <span>Is Active</span>
            </label>
          </div>

          {/* Submit */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 transition-colors"
            >
              {mutation.isPending ? "Creating..." : "Create Turf"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTurfs;
