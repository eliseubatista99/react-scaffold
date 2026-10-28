import { cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useFetch } from "../src/hooks/useFetch";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("useFetch", () => {
  it("appends query parameters to an existing query before the URL fragment", async () => {
    const fetchMock = vi.fn<typeof fetch>();
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ items: [] }), { status: 200 }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const { result } = renderHook(() => useFetch());

    await result.current.get("https://example.com/items?active=true#results", {
      tag: ["react", "typescript"],
      empty: null,
    });

    expect(fetchMock.mock.calls[0][0]).toBe(
      "https://example.com/items?active=true&tag=react&tag=typescript#results",
    );
  });

  it("supports HeadersInit forms and preserves an explicit content type", async () => {
    const fetchMock = vi.fn<typeof fetch>();
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ created: true }), { status: 201 }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const { result } = renderHook(() => useFetch());

    await result.current.post(
      "https://example.com/items",
      { title: "Example" },
      [
        ["X-Request-Id", "request-1"],
        ["Content-Type", "application/vnd.example+json"],
      ],
    );

    const request = fetchMock.mock.calls[0][1];
    const headers = new Headers(request?.headers);

    expect(request?.body).toBe(JSON.stringify({ title: "Example" }));
    expect(headers.get("Content-Type")).toBe("application/vnd.example+json");
    expect(headers.get("X-Request-Id")).toBe("request-1");
  });

  it("sets JSON content type by default for body methods", async () => {
    const fetchMock = vi.fn<typeof fetch>();
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ updated: true }), { status: 200 }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const { result } = renderHook(() => useFetch());

    await result.current.put("https://example.com/items/1", { active: true });

    const request = fetchMock.mock.calls[0][1];
    expect(new Headers(request?.headers).get("Content-Type")).toBe(
      "application/json",
    );
  });

  it("returns an undefined result without a parsing error for an empty response", async () => {
    const fetchMock = vi.fn<typeof fetch>();
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);
    const { result } = renderHook(() => useFetch());

    await expect(
      result.current.get("https://example.com/items"),
    ).resolves.toEqual({
      result: undefined,
      statusCode: 204,
    });
  });

  it("returns JSON parsing failures in the output", async () => {
    const fetchMock = vi.fn<typeof fetch>();
    fetchMock.mockResolvedValueOnce(new Response("not JSON", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const { result } = renderHook(() => useFetch());

    const response = await result.current.get("https://example.com/items");

    expect(response.result).toBeUndefined();
    expect(response.statusCode).toBe(200);
    expect(response.error).toBeInstanceOf(SyntaxError);
  });

  it("continues to reject when the network request fails", async () => {
    const networkError = new TypeError("Network unavailable");
    const fetchMock = vi.fn<typeof fetch>();
    fetchMock.mockRejectedValueOnce(networkError);
    vi.stubGlobal("fetch", fetchMock);
    const { result } = renderHook(() => useFetch());

    await expect(
      result.current.get("https://example.com/items"),
    ).rejects.toBe(networkError);
  });
});
