import Link from "next/link";

function AdminSelectionCard({ title, icon, link }) {
  // Decide if we want "Manage" in front
  const displayTitle = title.toLowerCase() === "transactions" ? title : `Manage ${title}`;

  return (
    <section className="w-[20rem] rounded-xl overflow-hidden text-white shadow-2xl transition-all hover:scale-[101%] hover:translate-y-[-.5rem] duration-300">
      <header className="text-center py-8 h-[6rem] bg-[#003883]">
        <h2 className="text-2xl font-bold">{displayTitle}</h2>
      </header>
      <div className="m-auto h-[24rem] flex flex-col justify-between text-[#003883] p-[2rem]">
        <div className="m-auto pb-[2rem]">{icon || "No Icon"}</div>
        <Link
          href={link || "/"}
          className="bg-[#ee7d11] flex justify-center shadow-xl p-2 rounded-md text-white w-full font-bold transition-all hover:scale-[101%] duration-300"
        >
          Select
        </Link>
      </div>
    </section>
  );
}

export { AdminSelectionCard };
