import { ButtonLink } from "@/components/ui/button-link";

export default function NotFound() {
  return (
    <section className="not-found-view">
      <div className="not-found-view__number" aria-hidden="true">404</div>
      <div className="not-found-view__copy"><p>This link is out of bounds.</p><h1>We could not find this page.</h1><span>The address may be incomplete or outdated. Your booking is unaffected.</span><ButtonLink href="/">Return home</ButtonLink></div>
    </section>
  );
}
