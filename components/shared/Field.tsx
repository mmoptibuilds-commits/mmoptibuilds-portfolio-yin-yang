import { cn } from "@/lib/cn";

/**
 * Form field primitives, shared by both divisions.
 *
 * These carry accessibility behaviour, not visual identity: colour, type and
 * spacing come from division tokens, so the same field renders as an
 * instrument input under Systems and as an editorial input under Studio.
 *
 * Rules enforced here rather than left to each call site:
 *   - every control has a real, visible <label> — never a placeholder as label
 *   - help text and errors are wired with aria-describedby
 *   - an invalid control gets aria-invalid and is announced
 *   - targets are at least 44px tall
 */

type BaseProps = {
  name: string;
  label: string;
  help?: string;
  error?: string;
  required?: boolean;
  defaultValue?: string;
};

function ids(name: string) {
  return { help: `${name}-help`, error: `${name}-error` };
}

function describedBy(name: string, help?: string, error?: string) {
  const id = ids(name);
  const parts = [help ? id.help : null, error ? id.error : null].filter(Boolean);
  return parts.length ? parts.join(" ") : undefined;
}

function FieldFrame({
  name,
  label,
  help,
  error,
  required,
  children,
}: BaseProps & { children: React.ReactNode }) {
  const id = ids(name);
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-step-0 font-medium text-ink">
        {label}
        {required ? (
          <span className="ml-1 text-accent" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="ml-2 text-step--1 font-normal text-ink-faint">
            optional
          </span>
        )}
      </label>

      {help ? (
        <p id={id.help} className="text-step--1 leading-[1.5] text-ink-muted">
          {help}
        </p>
      ) : null}

      {children}

      {error ? (
        <p
          id={id.error}
          className="flex items-start gap-2 text-step--1 text-accent"
        >
          <span aria-hidden="true">↳</span>
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}

const controlClass = (error?: string) =>
  cn(
    "min-h-11 w-full border bg-surface-raised px-3 py-2.5 text-step-0 text-ink",
    "transition-colors duration-(--duration-micro)",
    "placeholder:text-ink-faint",
    error ? "border-accent" : "border-border-control hover:border-ink-muted",
  );

export function TextField({
  type = "text",
  autoComplete,
  inputMode,
  placeholder,
  ...props
}: BaseProps & {
  type?: "text" | "email" | "tel" | "url" | "number";
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "url" | "numeric";
  placeholder?: string;
}) {
  return (
    <FieldFrame {...props}>
      <input
        id={props.name}
        name={props.name}
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        defaultValue={props.defaultValue}
        required={props.required}
        aria-invalid={props.error ? true : undefined}
        aria-describedby={describedBy(props.name, props.help, props.error)}
        className={controlClass(props.error)}
      />
    </FieldFrame>
  );
}

export function TextArea({
  rows = 4,
  placeholder,
  ...props
}: BaseProps & { rows?: number; placeholder?: string }) {
  return (
    <FieldFrame {...props}>
      <textarea
        id={props.name}
        name={props.name}
        rows={rows}
        placeholder={placeholder}
        defaultValue={props.defaultValue}
        required={props.required}
        aria-invalid={props.error ? true : undefined}
        aria-describedby={describedBy(props.name, props.help, props.error)}
        className={cn(controlClass(props.error), "min-h-28 resize-y leading-[1.55]")}
      />
    </FieldFrame>
  );
}

export function SelectField({
  options,
  placeholder = "Choose one",
  ...props
}: BaseProps & {
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <FieldFrame {...props}>
      <select
        id={props.name}
        name={props.name}
        defaultValue={props.defaultValue ?? ""}
        required={props.required}
        aria-invalid={props.error ? true : undefined}
        aria-describedby={describedBy(props.name, props.help, props.error)}
        className={cn(controlClass(props.error), "appearance-none pr-10")}
        style={{
          // Chevron drawn inline so no icon font or SVG request is needed, and
          // it inherits the division's ink automatically.
          backgroundImage:
            "linear-gradient(45deg, transparent 50%, currentColor 50%), linear-gradient(135deg, currentColor 50%, transparent 50%)",
          backgroundPosition:
            "calc(100% - 1.25rem) calc(50% + 0.1rem), calc(100% - 0.9rem) calc(50% + 0.1rem)",
          backgroundSize: "0.35rem 0.35rem, 0.35rem 0.35rem",
          backgroundRepeat: "no-repeat",
        }}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldFrame>
  );
}

/**
 * Radio group. Used instead of a select where there are few options and the
 * choice is consequential — seeing all options at once is faster than opening
 * a menu, and it works better on a phone.
 */
export function RadioGroup({
  name,
  label,
  help,
  error,
  options,
  defaultValue,
  required,
}: BaseProps & { options: { value: string; label: string; hint?: string }[] }) {
  const id = ids(name);
  return (
    <fieldset
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy(name, help, error)}
    >
      <legend className="text-step-0 font-medium text-ink">
        {label}
        {required ? (
          <span className="ml-1 text-accent" aria-hidden="true">
            *
          </span>
        ) : null}
      </legend>

      {help ? (
        <p id={id.help} className="mt-2 text-step--1 leading-[1.5] text-ink-muted">
          {help}
        </p>
      ) : null}

      <div className="mt-3 flex flex-col gap-px bg-rule">
        {options.map((o) => (
          <label
            key={o.value}
            className={cn(
              "flex min-h-11 cursor-pointer items-start gap-3 bg-surface-raised px-3 py-3",
              "transition-colors duration-(--duration-micro)",
              "hover:bg-surface has-checked:bg-surface",
              "has-focus-visible:outline has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent",
            )}
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              defaultChecked={defaultValue === o.value}
              required={required}
              className="mt-1 h-4 w-4 shrink-0 accent-[var(--accent)]"
            />
            <span>
              <span className="block text-step-0 text-ink">{o.label}</span>
              {o.hint ? (
                <span className="mt-0.5 block text-step--1 text-ink-muted">
                  {o.hint}
                </span>
              ) : null}
            </span>
          </label>
        ))}
      </div>

      {error ? (
        <p id={id.error} className="mt-2 flex items-start gap-2 text-step--1 text-accent">
          <span aria-hidden="true">↳</span>
          <span>{error}</span>
        </p>
      ) : null}
    </fieldset>
  );
}

export function ConsentField({ error, notice }: { error?: string; notice: string }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          name="consent"
          value="on"
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "consent-error" : undefined}
          className="mt-1 h-4 w-4 shrink-0 accent-[var(--accent)]"
        />
        <span className="text-step--1 leading-[1.55] text-ink-muted">{notice}</span>
      </label>
      {error ? (
        <p id="consent-error" className="flex items-start gap-2 text-step--1 text-accent">
          <span aria-hidden="true">↳</span>
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}

/**
 * Honeypot. Hidden from sighted users AND from screen readers — a field a
 * screen-reader user could focus and fill would be a trap, not a defence.
 */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
      <label htmlFor="botField">Leave this field empty</label>
      <input id="botField" name="botField" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}
