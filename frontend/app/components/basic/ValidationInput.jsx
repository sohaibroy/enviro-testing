import { cn } from "@/utils/mergeCss";

function ValidationInput({
  title,
  value,
  type,
  onChange,
  errorMessage,
  className,
  disabled,
  defaultValue,
  name,
  min,
}) {
  const errorHidden =
    errorMessage?.length > 0 && typeof errorMessage !== "undefined";

  return (
    <div className={cn("flex flex-col w-full md:w-[49%]", className)}>
      <label
        className={`font-bold ${
          disabled ? "text-gray-500" : "text-enviro_blue"
        }`}
      >
        {title || null}
      </label>
      <input
        id={title || null}
        min={min}
        name={name}
        defaultValue={defaultValue}
        className={`border-[.08rem] h-[2.5rem] rounded-md px-2 ${
          disabled ? "bg-gray-50 text-gray-300 border-gray-200" : ""
        } ${errorHidden ? "border-red-400" : "border-gray-400"}`}
        disabled={disabled}
        type={type || "text"}
        value={value}
        onChange={onChange}
      />
      <p hidden={!errorHidden} className="text-red-400 text-xs">
        {errorMessage}
      </p>
    </div>
  );
}

export { ValidationInput };
