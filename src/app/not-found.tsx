import { ButtonLink } from "@/components/ui/button-link";

export default function NotFound() {
  return (
    <section className="not-found-view">
      <div className="not-found-view__number" aria-hidden="true">404</div>
      <div className="not-found-view__copy"><p>This page is out of bounds.</p><h1>Whistle blown.</h1><span>The ball went somewhere we didn&apos;t expect. This page doesn&apos;t exist. Unlike your field — which is still available.</span><ButtonLink href="/">Back to the pitch</ButtonLink></div>
    </section>
  );
}
