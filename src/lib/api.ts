export async function fetcher<JSON = unknown>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  const result = await fetch(input, init);

  if (!result.ok) {
    const error = await result.json();
    throw new Error(
      error.message || "An error occurred while fetching the data",
    );
  }
  return result.json();
}
