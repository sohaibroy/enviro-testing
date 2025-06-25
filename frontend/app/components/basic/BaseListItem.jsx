import FadeIn from "./FadeIn";

function BaseListItem({ children }) {
  return (
    <FadeIn>
      <div className="w-full my-[1rem] bg-white flex justify-between overflow-hidden rounded-xl shadow-xl ring-1 p-4 ring-gray-300">
        {children}
      </div>
    </FadeIn>
  );
}

export { BaseListItem };
