"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { signIn } from "next-auth/react";
import "react-toastify/dist/ReactToastify.css";

interface RegistrationFormProps {
  className?: string;
  onToggleForm: () => void;
}

export default function RegistrationForm({
  className,
  onToggleForm,
}: RegistrationFormProps) {
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [bioError, setBioError] = useState("");
  const [username, setUsername] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  );
  const [checkingUsername, setCheckingUsername] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (bio.length > 250) {
      setBioError("Bio cannot exceed 250 characters");
    } else {
      setBioError("");
    }
  }, [bio]);

  const checkUsernameAvailability = async () => {
    if (!username) return;
    setCheckingUsername(true);
    setUsernameAvailable(null);

    const query = `
    query CheckUsername($username: String!) {
      isUsernameAvailable(username: $username) {
        exists
      }
    }
  `;

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          variables: { username },
        }),
      });

      const result = await response.json();
      console.log("GraphQL result:", result);
      if (result.errors) {
        console.error("GraphQL errors:", result.errors);
        toast.error("Failed to check username availability");
        setUsernameAvailable(null);
        setCheckingUsername(false);
        return;
      }

      // Access the 'exists' field and invert it to match usernameAvailable logic
      const isAvailable = !result?.data?.isUsernameAvailable?.exists;
      setUsernameAvailable(isAvailable);
      setCheckingUsername(false);
    } catch (error) {
      console.error("Error checking username:", error);
      toast.error("Failed to check username availability");
      setUsernameAvailable(null);
      setCheckingUsername(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!usernameAvailable) {
      toast.error("Username is not available");
      return;
    }
    if (bio.length > 250) {
      toast.error("Bio exceeds character limit");
      return;
    }

    setLoading(true);
    try {
      const query = `
        mutation Register($input: RegisterInput!) {
          register(input: $input) {
            ... on AuthPayload {
              accessToken
              refreshToken
              user {
                id
                username
                email
                image
              }
            }
            ... on AuthError {
              message
              code
            }
          }
        }
      `;

      const variables = {
        input: {
          fullName,
          bio,
          username,
          email,
          password,
          image: null,
        },
      };

      const map = image ? { "0": ["variables.input.image"] } : {};
      const formData = new FormData();
      formData.append("operations", JSON.stringify({ query, variables }));
      formData.append("map", JSON.stringify(map));
      if (image) formData.append("0", image);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: formData,
      });

      const { data } = await res.json();
      const result = data?.register;

      if (!result || result.__typename === "AuthError") {
        throw new Error(result?.message || "Registration failed");
      }

      const signInResult = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (signInResult?.error || !signInResult?.ok) {
        throw new Error(
          signInResult?.error || "Failed to sign in after registration"
        );
      }

      toast.success("Registration successful! Redirecting...");
      router.push("/home");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed. Please try again.");
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
    } else {
      toast.error("Please select a valid image file");
    }
  };

  return (
    <div
      className={`bg-white p-8 rounded-2xl shadow-lg w-full max-w-md ${className}`}
    >
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
        Create Account
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700"
          >
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-gray-700"
          >
            Bio
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself in 250 characters"
            maxLength={300}
            rows={3}
            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          />
          <p className="text-xs text-gray-500">{bio.length}/250 characters</p>
          {bioError && <p className="text-xs text-red-500">{bioError}</p>}
        </div>

        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onBlur={checkUsernameAvailability}
            onChange={(e) => {
              setUsername(e.target.value);
              setUsernameAvailable(null); // reset on change
            }}
            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={loading}
          />
          <p className="text-xs mt-1">
            {checkingUsername && (
              <span className="text-blue-500">
                Checking username availability...
              </span>
            )}
            {username && usernameAvailable === true && !checkingUsername && (
              <span className="text-green-500">Username available ✅</span>
            )}
            {username && usernameAvailable === false && !checkingUsername && (
              <span className="text-red-500">Username already taken ❌</span>
            )}
          </p>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700"
          >
            Profile Image (Optional)
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 w-full px-4 py-2 border rounded-lg"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400"
          disabled={loading || !usernameAvailable}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>
    </div>
  );
}
