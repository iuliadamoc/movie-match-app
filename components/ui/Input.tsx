"use client";

type InputProps = {
  label: string;
  type?: string;
  value: string;
  onChange: (e: any) => void;
};

export default function Input({
  label,
  type = "text",
  value,
  onChange,
}: InputProps) {
  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="peer w-full border border-gray-300 p-3 pt-5 rounded-lg focus:ring-2 focus:ring-black outline-none"
      />
      <label className="absolute left-3 top-2 text-xs text-gray-500">
        {label}
      </label>
    </div>
  );
}