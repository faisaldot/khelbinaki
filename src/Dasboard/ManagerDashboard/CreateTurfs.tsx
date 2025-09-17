// src/pages/admin/CreateTurfs.tsx
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../../api/axiosInstance";

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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    __v: 0,
    pricingRules: [
      { dayType: "", startTime: "06:00", endTime: "23:00", pricePerSlot: "" },
    ],
  });

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const mutation = useMutation({
    mutationFn: async (newTurf: any) => {
      const res = await api.post("/turfs", newTurf);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Turf created successfully!");
    },
    onError: (err: any) => {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to create turf!");
    },
  });

  // input handle
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  // Pricing rules
  const handleRuleChange = (
    index: number,
    field: keyof PricingRule,
    value: string
  ) => {
    const updated = [...formData.pricingRules];
    (updated[index] as any)[field] = value;
    setFormData((s) => ({ ...s, pricingRules: updated }));
  };

  const addRule = () => {
    setFormData((s) => ({
      ...s,
      pricingRules: [
        ...s.pricingRules,
        { dayType: "", startTime: "06:00", endTime: "23:00", pricePerSlot: "" },
      ],
    }));
  };

  const removeRule = (index: number) => {
    setFormData((s) => ({
      ...s,
      pricingRules: s.pricingRules.filter((_, i) => i !== index),
    }));
  };

  // Amenities
  const toggleAmenity = (key: string) => {
    setSelectedAmenities((s) =>
      s.includes(key) ? s.filter((k) => k !== key) : [...s, key]
    );
  };

  // images handler
  const handleImageChange = (index: number, value: string) => {
    const updated = [...formData.images];
    updated[index] = value;
    setFormData((s) => ({ ...s, images: updated }));
  };

  const addImage = () => {
    setFormData((s) => ({ ...s, images: [...s.images, ""] }));
  };

  const removeImage = (index: number) => {
    setFormData((s) => ({
      ...s,
      images: s.images.filter((_, i) => i !== index),
    }));
  };

  // admins handler
  const handleAdminChange = (index: number, value: string) => {
    const updated = [...formData.admins];
    updated[index] = value;
    setFormData((s) => ({ ...s, admins: updated }));
  };

  const addAdmin = () => {
    setFormData((s) => ({ ...s, admins: [...s.admins, ""] }));
  };

  const removeAdmin = (index: number) => {
    setFormData((s) => ({
      ...s,
      admins: s.admins.filter((_, i) => i !== index),
    }));
  };

  // Function to group pricing rules by day type
  const groupPricingRules = () => {
    const groupedRules = formData.pricingRules.reduce((acc, rule) => {
      // Check if the dayType is valid and not empty
      if (!rule.dayType) return acc;

      // Initialize the entry for the dayType if it doesn't exist
      if (!acc[rule.dayType]) {
        acc[rule.dayType] = {
          dayType: rule.dayType,
          timeSlots: [],
        };
      }

      // Add the time slot to the corresponding dayType
      acc[rule.dayType].timeSlots.push({
        startTime: rule.startTime,
        endTime: rule.endTime,
        pricePerSlot: Number(rule.pricePerSlot) || 0,
      });

      return acc;
    }, {});

    // Convert the object of grouped rules into an array
    return Object.values(groupedRules);
  };

  // Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Call the new function to get the correctly formatted pricing rules payload
    const pricingRulesPayload = groupPricingRules();

    const payload = {
      name: formData.name,
      location: { address: formData.address, city: formData.city },
      description: formData.description,
      defaultPricePerSlot: Number(formData.defaultPricePerSlot) || 0,
      pricingRules: pricingRulesPayload,
      operatingHours: { start: formData.startHour, end: formData.endHour },
      amenities: selectedAmenities,
      images: formData.images.filter((img) => img.trim() !== ""),
      admins: formData.admins
        .filter((a) => a.trim() !== "")
        .map((id) => ({ $oid: id })),
      isActive: formData.isActive,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-"),
      createdAt: { $date: formData.createdAt },
      updatedAt: { $date: formData.updatedAt },
      __v: formData.__v,
    };

    console.log("Submitting payload:", JSON.stringify(payload, null, 2));
    mutation.mutate(payload);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="w-full max-w-6xl bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create New Turf
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          {/* basic */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Turf Name"
              className="p-3 rounded-lg border border-gray-300"
            />
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Address"
              className="p-3 rounded-lg border border-gray-300"
            />
            <input
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              placeholder="City"
              className="p-3 rounded-lg border border-gray-300"
            />
            <input
              name="defaultPricePerSlot"
              value={formData.defaultPricePerSlot}
              onChange={handleChange}
              required
              placeholder="Default Price Per Slot"
              type="number"
              className="p-3 rounded-lg border border-gray-300"
            />
          </div>

          {/* Hours */}
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col">
              <span className="text-sm text-gray-600 mb-1">Start Hour</span>
              <input
                type="time"
                name="startHour"
                value={formData.startHour}
                onChange={handleChange}
                className="p-2 rounded-lg border border-gray-300"
              />
            </label>
            <label className="flex flex-col">
              <span className="text-sm text-gray-600 mb-1">End Hour</span>
              <input
                type="time"
                name="endHour"
                value={formData.endHour}
                onChange={handleChange}
                className="p-2 rounded-lg border border-gray-300"
              />
            </label>
          </div>

          {/* description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              required
              className="w-full p-3 rounded-lg border border-gray-300"
            />
          </div>

          {/* amenities */}
          <div>
            <h3 className="font-semibold mb-3">Choose Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {PRESET_AMENITIES.map((a) => {
                const active = selectedAmenities.includes(a.key);
                return (
                  <button
                    type="button"
                    key={a.key}
                    onClick={() => toggleAmenity(a.key)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-shadow focus:outline-none ${
                      active
                        ? "border-emerald-400 shadow-sm bg-emerald-50"
                        : "border-gray-200 hover:shadow-sm"
                    }`}
                    aria-pressed={active}
                  >
                    <div className="text-2xl">{a.icon}</div>
                    <div className="text-sm text-gray-700">{a.label}</div>
                    <div className="text-xs text-gray-500">
                      {active ? "Selected" : "Tap to add"}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* images */}
          <div>
            <h3 className="font-semibold mb-2">Images (URLs)</h3>
            {formData.images.map((img, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={img}
                  onChange={(e) => handleImageChange(i, e.target.value)}
                  placeholder="https://..."
                  className="flex-1 p-2 border rounded"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="px-2 bg-red-500 text-white rounded"
                >
                  X
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addImage}
              className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded"
            >
              + Add Image
            </button>
          </div>

          {/* admins */}
          <div>
            <h3 className="font-semibold mb-2">Admins (Object IDs)</h3>
            {formData.admins.map((a, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={a}
                  onChange={(e) => handleAdminChange(i, e.target.value)}
                  placeholder="MongoDB ObjectID"
                  className="flex-1 p-2 border rounded"
                />
                <button
                  type="button"
                  onClick={() => removeAdmin(i)}
                  className="px-2 bg-red-500 text-white rounded"
                >
                  X
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addAdmin}
              className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded"
            >
              + Add Admin
            </button>
          </div>

          {/* pricing rules */}
          <div>
            <h3 className="font-semibold mb-3">Pricing Rules</h3>
            <div className="space-y-3">
              {formData.pricingRules.map((rule, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 md:grid-cols-6 gap-2 items-center"
                >
                  <input
                    value={rule.dayType}
                    onChange={(e) =>
                      handleRuleChange(idx, "dayType", e.target.value)
                    }
                    placeholder="e.g. sunday-thursday"
                    className="col-span-2 p-2 border rounded"
                  />
                  <input
                    type="time"
                    value={rule.startTime}
                    onChange={(e) =>
                      handleRuleChange(idx, "startTime", e.target.value)
                    }
                    className="p-2 border rounded"
                  />
                  <input
                    type="time"
                    value={rule.endTime}
                    onChange={(e) =>
                      handleRuleChange(idx, "endTime", e.target.value)
                    }
                    className="p-2 border rounded"
                  />
                  <input
                    type="number"
                    value={rule.pricePerSlot as any}
                    onChange={(e) =>
                      handleRuleChange(idx, "pricePerSlot", e.target.value)
                    }
                    placeholder="price"
                    className="p-2 border rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeRule(idx)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addRule}
              className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded"
            >
              + Add Rule
            </button>
          </div>

          {/* slug & isActive */}
          <div className="grid grid-cols-2 gap-4">
            <input
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="Slug (auto if empty)"
              className="p-2 border rounded"
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

          {/* final */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors disabled:opacity-50"
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