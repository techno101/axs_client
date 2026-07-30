import { ButtonLink } from "@/components/ui/button-link";

export default function NotFound() {
  return (
    <section className="not-found-view">
      <div className="not-found-view__number" aria-hidden="true">404</div>
      <div className="not-found-view__copy"><p>Page not found</p><h1>We could not find this page.</h1><span>The route may have moved, or the link may be incomplete.</span><ButtonLink href="/">Return home</ButtonLink></div>
    </section>
  );
}
