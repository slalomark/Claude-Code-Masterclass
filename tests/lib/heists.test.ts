import { fetchUsers, createHeist } from "@/lib/heists";
import { CreateHeistInput } from "@/types/firestore";

vi.mock("@/lib/firebase", () => ({ db: {} }));

const mockGetDocs = vi.fn();
const mockAddDoc = vi.fn();
const mockCollection = vi.fn(() => "collection-ref");
vi.mock("firebase/firestore", () => ({
  getDocs: (...args: unknown[]) => mockGetDocs(...args),
  addDoc: (...args: unknown[]) => mockAddDoc(...args),
  collection: (...args: unknown[]) => mockCollection(...args),
  serverTimestamp: () => "server-timestamp",
}));

describe("fetchUsers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns users excluding the provided UID", async () => {
    mockGetDocs.mockResolvedValue({
      forEach: (cb: (doc: { data: () => unknown }) => void) => {
        cb({ data: () => ({ id: "user1", codename: "ShadowFox" }) });
        cb({ data: () => ({ id: "user2", codename: "NightOwl" }) });
        cb({ data: () => ({ id: "user3", codename: "StealthWolf" }) });
      },
    });

    const result = await fetchUsers("user1");

    expect(result).toEqual([
      { id: "user2", codename: "NightOwl" },
      { id: "user3", codename: "StealthWolf" },
    ]);
  });

  it("returns empty array when collection is empty", async () => {
    mockGetDocs.mockResolvedValue({
      forEach: () => {},
    });

    const result = await fetchUsers("user1");
    expect(result).toEqual([]);
  });
});

describe("createHeist", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls addDoc with the heists collection and input", async () => {
    mockAddDoc.mockResolvedValue({ id: "new-heist-id" });

    const input: CreateHeistInput = {
      title: "Bank Job",
      description: "A daring heist",
      createdBy: "user1",
      createdByCodename: "ShadowFox",
      assignedTo: "user2",
      assignedToCodename: "NightOwl",
      deadline: new Date("2026-03-24T00:00:00Z"),
      finalStatus: null,
      createdAt: "server-timestamp" as unknown as CreateHeistInput["createdAt"],
    };

    const id = await createHeist(input);

    expect(id).toBe("new-heist-id");
    expect(mockAddDoc).toHaveBeenCalledWith("collection-ref", input);
    expect(mockCollection).toHaveBeenCalledWith({}, "heists");
  });
});
