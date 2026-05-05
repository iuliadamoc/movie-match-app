export default function Card({ children }: any) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
      {children}
    </div>
  );
}