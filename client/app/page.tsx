const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export default function HomePage() {
  return (
    <main>
      <p>Next.js frontend is running.</p>
      <p>
        API health check: <a href={`${apiUrl}/health`}>{apiUrl}/health</a>
      </p>
    </main>
  );
}

