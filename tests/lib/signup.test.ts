import { signup, getSignupErrorMessage } from "@/lib/signup";

vi.mock("@/lib/firebase", () => ({ auth: {}, db: {} }));

const mockCreateUser = vi.fn();
const mockUpdateProfile = vi.fn();
vi.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: (...args: unknown[]) =>
    mockCreateUser(...args),
  updateProfile: (...args: unknown[]) => mockUpdateProfile(...args),
}));

const mockDoc = vi.fn(() => "doc-ref");
const mockSetDoc = vi.fn();
vi.mock("firebase/firestore", () => ({
  doc: (...args: unknown[]) => mockDoc(...args),
  setDoc: (...args: unknown[]) => mockSetDoc(...args),
}));

vi.mock("@/lib/generateCodename", () => ({
  generateCodename: () => "SilentFoxVault",
}));

describe("signup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateUser.mockResolvedValue({ user: { uid: "abc123" } });
    mockUpdateProfile.mockResolvedValue(undefined);
    mockSetDoc.mockResolvedValue(undefined);
  });

  it("creates user, sets display name, and writes Firestore doc", async () => {
    await signup("test@example.com", "password123");

    expect(mockCreateUser).toHaveBeenCalledWith(
      {},
      "test@example.com",
      "password123",
    );
    expect(mockUpdateProfile).toHaveBeenCalledWith(
      { uid: "abc123" },
      { displayName: "SilentFoxVault" },
    );
    expect(mockSetDoc).toHaveBeenCalledWith("doc-ref", {
      codename: "SilentFoxVault",
      id: "abc123",
    });
  });

  it("does not call updateProfile or setDoc when auth fails", async () => {
    const authError = new Error("fail");
    (authError as unknown as { code: string }).code =
      "auth/email-already-in-use";
    mockCreateUser.mockRejectedValue(authError);

    await expect(signup("test@example.com", "pw")).rejects.toThrow();
    expect(mockUpdateProfile).not.toHaveBeenCalled();
    expect(mockSetDoc).not.toHaveBeenCalled();
  });

  it("Firestore doc contains only codename and id", async () => {
    await signup("test@example.com", "password123");

    const writtenData = mockSetDoc.mock.calls[0][1];
    expect(Object.keys(writtenData)).toEqual(["codename", "id"]);
    expect(writtenData).not.toHaveProperty("email");
  });
});

describe("getSignupErrorMessage", () => {
  it("returns friendly message for auth/email-already-in-use", () => {
    const err = Object.assign(new Error(), {
      code: "auth/email-already-in-use",
    });
    expect(getSignupErrorMessage(err)).toBe(
      "That email is already registered.",
    );
  });

  it("returns friendly message for auth/weak-password", () => {
    const err = Object.assign(new Error(), { code: "auth/weak-password" });
    expect(getSignupErrorMessage(err)).toBe(
      "Password must be at least 6 characters.",
    );
  });

  it("returns friendly message for auth/invalid-email", () => {
    const err = Object.assign(new Error(), { code: "auth/invalid-email" });
    expect(getSignupErrorMessage(err)).toBe(
      "Please enter a valid email address.",
    );
  });

  it("returns default message for unknown errors", () => {
    expect(getSignupErrorMessage(new Error("random"))).toBe(
      "Something went wrong. Please try again.",
    );
  });
});
