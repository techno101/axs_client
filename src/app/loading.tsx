export default function Loading() {
  return (
    <div className="loading-view" role="status" aria-label="Loading page">
      <div className="loading-view__hero skeleton" />
      <div className="shell loading-view__body"><span className="skeleton" /><span className="skeleton" /><div><i className="skeleton" /><i className="skeleton" /></div></div>
    </div>
  );
}
