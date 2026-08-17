"use client";

import { EnquiryForm } from "@/components/shared/EnquiryForm";
import {
  ConsentField,
  Honeypot,
  RadioGroup,
  SelectField,
  TextArea,
  TextField,
} from "@/components/shared/Field";
import { BUDGET_LABELS, TIMING_LABELS } from "@/lib/enquiry-schema";

const CONSENT =
  "I am happy for mmoptibuilds to store these details and reply to me by email about this enquiry.";

const budgetOptions = Object.entries(BUDGET_LABELS).map(([value, label]) => ({ value, label }));
const timingOptions = Object.entries(TIMING_LABELS).map(([value, label]) => ({ value, label }));

/**
 * Form 1 — Systems build brief.
 *
 * Field order follows how someone actually thinks about a build: what it is
 * for, then what they already have, then money and logistics. Contact details
 * come last, because asking for an email address before explaining anything
 * is the fastest way to lose a form.
 */
export function SystemBuildForm({ sourcePath }: { sourcePath: string }) {
  return (
    <EnquiryForm
      intent="system-build"
      sourcePath={sourcePath}
      tone="instrument"
      title="Describe the build"
      intro="Only three fields are required. The rest exist because answering them here saves an email round trip — every one of them changes the parts list."
      submitLabel="Send requirements"
    >
      {(errors, values) => (
        <>
          <Honeypot />

          <fieldset className="flex flex-col gap-6">
            <legend className="label-instrument mb-2 text-ink-faint">
              01 — The machine
            </legend>

            <TextArea
              name="useCase"
              label="What will it be doing?"
              help="Games and target resolution, or the applications you run. A sentence is plenty."
              placeholder="1440p at 144Hz, mostly competitive shooters, some Blender on the side."
              required
              rows={3}
              error={errors.useCase}
              defaultValue={values.useCase}
            />

            <TextField
              name="applications"
              label="Specific titles or software"
              help="If any single one matters more than the rest, name it."
              error={errors.applications}
              defaultValue={values.applications}
            />

            <TextField
              name="priorities"
              label="What matters most?"
              help="For example: frame rate, quiet operation, small case, upgrade headroom."
              error={errors.priorities}
              defaultValue={values.priorities}
            />

            <TextArea
              name="existingParts"
              label="What do you already own?"
              help="Monitor, GPU, PSU, case, drives — anything worth building around or reusing."
              rows={3}
              error={errors.existingParts}
              defaultValue={values.existingParts}
            />
          </fieldset>

          <fieldset className="flex flex-col gap-6">
            <legend className="label-instrument mb-2 text-ink-faint">
              02 — Scope
            </legend>

            <RadioGroup
              name="assembly"
              label="Assembled and tested, or parts only?"
              required
              error={errors.assembly}
              defaultValue={values.assembly}
              options={[
                {
                  value: "assembled-tested",
                  label: "Assembled and tested",
                  hint: "Built, cable-managed, BIOS configured, load tested before delivery.",
                },
                {
                  value: "parts-only",
                  label: "Parts only",
                  hint: "Sourced and delivered; you build it.",
                },
                { value: "not-sure", label: "Not sure yet" },
              ]}
            />

            <SelectField
              name="budgetRange"
              label="Budget range"
              help="A range, and it stays private. It decides where the money goes, which matters more than the total."
              required
              options={budgetOptions}
              error={errors.budgetRange}
              defaultValue={values.budgetRange}
            />

            <SelectField
              name="timing"
              label="When would you want it?"
              required
              options={timingOptions}
              error={errors.timing}
              defaultValue={values.timing}
            />

            <TextField
              name="deliveryCity"
              label="Delivery city"
              help="Affects delivery options and tax treatment on the quote."
              autoComplete="address-level2"
              required
              error={errors.deliveryCity}
              defaultValue={values.deliveryCity}
            />

            <TextArea
              name="constraints"
              label="Anything else"
              help="Noise limits, desk size, aesthetics, a deadline, a previous bad experience."
              rows={3}
              error={errors.constraints}
              defaultValue={values.constraints}
            />
          </fieldset>

          <fieldset className="flex flex-col gap-6">
            <legend className="label-instrument mb-2 text-ink-faint">
              03 — Reply to
            </legend>

            <div className="grid gap-6 sm:grid-cols-2">
              <TextField
                name="name"
                label="Name"
                autoComplete="name"
                required
                error={errors.name}
                defaultValue={values.name}
              />
              <TextField
                name="email"
                label="Email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                error={errors.email}
                defaultValue={values.email}
              />
            </div>

            <TextField
              name="phone"
              label="Phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              help="Only if you would rather be called than emailed."
              error={errors.phone}
              defaultValue={values.phone}
            />

            <ConsentField error={errors.consent} notice={CONSENT} />
          </fieldset>
        </>
      )}
    </EnquiryForm>
  );
}

/**
 * Form 2 — Enterprise RFQ.
 *
 * Assumes competence. Procurement already knows the specification, so this
 * asks for it directly and does not explain what a part number is.
 */
export function EnterpriseRfqForm({ sourcePath }: { sourcePath: string }) {
  return (
    <EnquiryForm
      intent="enterprise-rfq"
      sourcePath={sourcePath}
      tone="instrument"
      title="Request for quotation"
      intro="Part number, quantity and delivery city are enough to start. Everything else sharpens the quote."
      submitLabel="Submit RFQ"
    >
      {(errors, values) => (
        <>
          <Honeypot />

          <fieldset className="flex flex-col gap-6">
            <legend className="label-instrument mb-2 text-ink-faint">
              01 — Specification
            </legend>

            <div className="grid gap-6 sm:grid-cols-2">
              <TextField
                name="manufacturer"
                label="Manufacturer"
                placeholder="Dell, HPE, Supermicro, Cisco…"
                required
                error={errors.manufacturer}
                defaultValue={values.manufacturer}
              />
              <TextField
                name="partNumber"
                label="Part number or SKU"
                help="The exact one. A description is a guess."
                required
                error={errors.partNumber}
                defaultValue={values.partNumber}
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <TextField
                name="quantity"
                label="Quantity"
                type="number"
                inputMode="numeric"
                required
                error={errors.quantity}
                defaultValue={values.quantity}
              />
              <RadioGroup
                name="partialFillAccepted"
                label="Is a partial quantity useful?"
                help="Distributor allocation is often the constraint."
                required
                error={errors.partialFillAccepted}
                defaultValue={values.partialFillAccepted}
                options={[
                  { value: "yes", label: "Yes, partial is useful" },
                  { value: "no", label: "No, full quantity only" },
                ]}
              />
            </div>

            <RadioGroup
              name="condition"
              label="Acceptable condition"
              required
              error={errors.condition}
              defaultValue={values.condition}
              options={[
                { value: "new-only", label: "New only" },
                { value: "refurbished-ok", label: "Refurbished acceptable" },
                { value: "open-box-ok", label: "Open-box acceptable" },
                { value: "any", label: "Any of the above" },
              ]}
            />

            <TextArea
              name="technicalRequirements"
              label="Technical requirements"
              help="Firmware, interface, form factor, bracket, compatibility with equipment already in service."
              rows={3}
              error={errors.technicalRequirements}
              defaultValue={values.technicalRequirements}
            />
          </fieldset>

          <fieldset className="flex flex-col gap-6">
            <legend className="label-instrument mb-2 text-ink-faint">
              02 — Commercial
            </legend>

            <TextField
              name="warrantyRequirement"
              label="Warranty or support requirement"
              help="Manufacturer warranty, distributor warranty, next-business-day — these are different products."
              error={errors.warrantyRequirement}
              defaultValue={values.warrantyRequirement}
            />

            <div className="grid gap-6 sm:grid-cols-2">
              <TextField
                name="deliveryCity"
                label="Delivery city or postcode"
                autoComplete="address-level2"
                required
                error={errors.deliveryCity}
                defaultValue={values.deliveryCity}
              />
              <TextField
                name="requiredDate"
                label="Required by"
                placeholder="Late September, or a firm date"
                error={errors.requiredDate}
                defaultValue={values.requiredDate}
              />
            </div>

            <TextArea
              name="taxRequirements"
              label="PO, GST and invoicing needs"
              help="Anything that has to be correct on the paperwork the first time."
              rows={2}
              error={errors.taxRequirements}
              defaultValue={values.taxRequirements}
            />
          </fieldset>

          <fieldset className="flex flex-col gap-6">
            <legend className="label-instrument mb-2 text-ink-faint">
              03 — Reply to
            </legend>

            <TextField
              name="organisation"
              label="Organisation"
              autoComplete="organization"
              required
              error={errors.organisation}
              defaultValue={values.organisation}
            />

            <div className="grid gap-6 sm:grid-cols-2">
              <TextField
                name="name"
                label="Name"
                autoComplete="name"
                required
                error={errors.name}
                defaultValue={values.name}
              />
              <TextField
                name="email"
                label="Work email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                error={errors.email}
                defaultValue={values.email}
              />
            </div>

            <TextField
              name="phone"
              label="Phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              error={errors.phone}
              defaultValue={values.phone}
            />

            <ConsentField error={errors.consent} notice={CONSENT} />
          </fieldset>
        </>
      )}
    </EnquiryForm>
  );
}

/**
 * Form 3 — Studio brief.
 *
 * Editorial tone. Opens with the business problem rather than a page count,
 * because a client who leads with "I need five pages" usually needs something
 * different from what they think.
 */
export function StudioBriefForm({ sourcePath }: { sourcePath: string }) {
  return (
    <EnquiryForm
      intent="studio-brief"
      sourcePath={sourcePath}
      tone="editorial"
      title="Start a brief"
      intro="Two required fields. Answer as much of the rest as is useful — a short honest answer beats a long speculative one."
      submitLabel="Send brief"
    >
      {(errors, values) => (
        <>
          <Honeypot />

          <fieldset className="flex flex-col gap-6">
            <legend className="mb-2 text-step--1 tracking-[0.08em] text-ink-faint uppercase">
              The situation
            </legend>

            <RadioGroup
              name="projectType"
              label="Which is closest?"
              required
              error={errors.projectType}
              defaultValue={values.projectType}
              options={[
                { value: "new-site", label: "A first proper website" },
                { value: "redesign", label: "Replacing an existing site" },
                { value: "startup-launch", label: "A launch site for a new company" },
                { value: "not-sure", label: "Not sure — happy to be told" },
              ]}
            />

            <TextArea
              name="businessGoal"
              label="What should the site do for the business?"
              help="Not what it should look like. What should change once it exists."
              placeholder="Stop losing enquiries to competitors who look more established."
              required
              rows={3}
              error={errors.businessGoal}
              defaultValue={values.businessGoal}
            />

            <TextField
              name="currentUrl"
              label="Current website"
              type="url"
              inputMode="url"
              help="If there is one. Including one you are embarrassed by — that is useful information."
              placeholder="https://"
              error={errors.currentUrl}
              defaultValue={values.currentUrl}
            />

            <TextArea
              name="audience"
              label="Who needs to be convinced?"
              rows={2}
              error={errors.audience}
              defaultValue={values.audience}
            />

            <TextField
              name="primaryConversion"
              label="What should a visitor do?"
              help="Call, submit a form, book, buy, apply, read something specific."
              error={errors.primaryConversion}
              defaultValue={values.primaryConversion}
            />
          </fieldset>

          <fieldset className="flex flex-col gap-6">
            <legend className="mb-2 text-step--1 tracking-[0.08em] text-ink-faint uppercase">
              Practicalities
            </legend>

            <TextArea
              name="requiredPages"
              label="Pages or capabilities you know you need"
              rows={2}
              error={errors.requiredPages}
              defaultValue={values.requiredPages}
            />

            <RadioGroup
              name="existingAssets"
              label="What do you already have?"
              help="Logo, photography, written copy, brand guidelines."
              required
              error={errors.existingAssets}
              defaultValue={values.existingAssets}
              options={[
                { value: "everything", label: "Most of it — logo, copy, images" },
                { value: "some", label: "Some of it" },
                { value: "nothing", label: "Essentially nothing yet" },
                { value: "not-sure", label: "Not sure what counts" },
              ]}
            />

            <RadioGroup
              name="hostingState"
              label="Domain and hosting"
              help="You keep ownership of both either way. This is about what exists now."
              required
              error={errors.hostingState}
              defaultValue={values.hostingState}
              options={[
                { value: "own-both", label: "I control both" },
                { value: "own-domain", label: "I control the domain only" },
                { value: "own-neither", label: "Someone else controls them" },
                { value: "not-sure", label: "Not sure" },
              ]}
            />

            <div className="grid gap-6 sm:grid-cols-2">
              <SelectField
                name="budgetRange"
                label="Budget range"
                help="Private. It decides scope, not quality."
                required
                options={budgetOptions}
                error={errors.budgetRange}
                defaultValue={values.budgetRange}
              />
              <SelectField
                name="timing"
                label="Timing"
                required
                options={timingOptions}
                error={errors.timing}
                defaultValue={values.timing}
              />
            </div>

            <TextField
              name="decisionMakers"
              label="Who signs this off?"
              help="Knowing how many people need to agree changes how the work is planned."
              error={errors.decisionMakers}
              defaultValue={values.decisionMakers}
            />

            <TextArea
              name="description"
              label="Anything else worth knowing"
              rows={4}
              error={errors.description}
              defaultValue={values.description}
            />
          </fieldset>

          <fieldset className="flex flex-col gap-6">
            <legend className="mb-2 text-step--1 tracking-[0.08em] text-ink-faint uppercase">
              Reply to
            </legend>

            <TextField
              name="organisation"
              label="Organisation"
              autoComplete="organization"
              error={errors.organisation}
              defaultValue={values.organisation}
            />

            <div className="grid gap-6 sm:grid-cols-2">
              <TextField
                name="name"
                label="Name"
                autoComplete="name"
                required
                error={errors.name}
                defaultValue={values.name}
              />
              <TextField
                name="email"
                label="Email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                error={errors.email}
                defaultValue={values.email}
              />
            </div>

            <TextField
              name="phone"
              label="Phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              error={errors.phone}
              defaultValue={values.phone}
            />

            <ConsentField error={errors.consent} notice={CONSENT} />
          </fieldset>
        </>
      )}
    </EnquiryForm>
  );
}
