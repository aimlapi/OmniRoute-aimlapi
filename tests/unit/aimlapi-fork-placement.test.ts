// FORK-ONLY placement guard — see the commit that introduced this file.
//
// This test exists only to pin the fork's dashboard placement for aimlapi.com. It
// is NOT an upstream concern and is deliberately confined to the same commit as
// the pin itself, so dropping that commit drops this file with it.
import test from "node:test";
import assert from "node:assert/strict";

import {
  getFeaturedProviderRank,
  isFeaturedProviderId,
} from "@/app/(dashboard)/dashboard/providers/featuredProviders";
import { sortProviderEntriesFeaturedFirst } from "@/app/(dashboard)/dashboard/providers/providerPageUtils";

const entry = (providerId: string, name: string) =>
  ({
    providerId,
    provider: { id: providerId, name },
    stats: { total: 0 },
    displayAuthType: "apikey" as const,
    toggleAuthType: "apikey" as const,
  }) as never;

test("aimlapi.com is pinned in the dashboard grids", () => {
  assert.equal(isFeaturedProviderId("aimlapi"), true);
  assert.equal(getFeaturedProviderRank("aimlapi"), 3);
});

test("the pin does not displace the operator's two ranked sponsors", () => {
  // Kimi (1) and Cheaper Inference (2) encode an explicit operator decision dated
  // 2026-07-31. The fork pin sits under them, never over them.
  assert.equal(getFeaturedProviderRank("moonshot"), 1);
  assert.equal(getFeaturedProviderRank("cheaperinference"), 2);
});

test("aimlapi.com sorts above unranked aggregators despite the alphabet", () => {
  // The aggregator grid is sorted by display name, so "aimlapi.com" would
  // otherwise fall between "AgentRouter" and "AnyAPI AI". The rank is the only
  // sanctioned lever for placement here — the catalog's key order does not reach
  // the rendered grid at all.
  const sorted = sortProviderEntriesFeaturedFirst([
    entry("openrouter", "OpenRouter"),
    entry("agentrouter", "AgentRouter"),
    entry("aimlapi", "aimlapi.com"),
    entry("cheaperinference", "Cheaper Inference"),
  ]);
  assert.deepEqual(
    sorted.map((e) => e.providerId),
    ["cheaperinference", "aimlapi", "agentrouter", "openrouter"]
  );
});
