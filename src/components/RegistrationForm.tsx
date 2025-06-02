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
  const [userBio, setUserBio] = useState("");
  const [userBioError, setUserBioError] = useState("");
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
    if (userBio.length > 250) {
      setUserBioError("User Bio cannot exceed 250 characters");
    } else {
      setUserBioError("");
    }
  }, [userBio]);

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
      const isAvailable = !result?.data?.isUsernameAvailable?.exists;
      setUsernameAvailable(isAvailable);
    } catch (error) {
      toast.error("Failed to check username availability");
      setUsernameAvailable(null);
    } finally {
      setCheckingUsername(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userBio.length > 250) {
      toast.error("Bio exceeds character limit");
      return;
    }
    if (usernameAvailable === false) {
      toast.error("Username is not available");
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
                fullName
                userBio
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
          userBio: userBio || null,
          username,
          email,
          password,
          image: null,
        },
      };

      const formData = new FormData();
      formData.append("operations", JSON.stringify({ query, variables }));

      if (image) {
        formData.append("map", JSON.stringify({ "0": ["variables.input.image"] }));
        formData.append("0", image);
      } else {
        formData.append("map", JSON.stringify({}));
      }

      const registrationResponse = await fetch("/api/auth/register", {
        method: "POST",
        body: formData,
      });

      const registrationResult = await registrationResponse.json();

      if (!registrationResponse.ok || registrationResult.error) {
        throw new Error(registrationResult.error || "Registration failed");
      }

      toast.success("Registration successful! Logging you in...");
      const signInResult = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (signInResult?.error || !signInResult?.ok) {
        toast.error("Registered but login failed. Try manually.");
        return;
      }

      toast.success("Welcome! Redirecting to your feed...");
      router.push("/my-feed");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed. Try again.");
    } finally {
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
      className={`bg-white p-8 rounded-2xl shadow-lg w-full max-w-4xl mx-auto ${className}`}
    >
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
        Create Account
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Column 1 */}
        <div className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
              Bio
            </label>
            <textarea
              id="bio"
              value={userBio}
              onChange={(e) => setUserBio(e.target.value)}
              maxLength={300}
              rows={3}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <p className="text-xs text-gray-500">{userBio.length}/250 characters</p>
            {userBioError && <p className="text-xs text-red-500">{userBioError}</p>}
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onBlur={checkUsernameAvailability}
              onChange={(e) => {
                setUsername(e.target.value);
                setUsernameAvailable(null);
              }}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            />
            <p className="text-xs mt-1">
              {checkingUsername && (
                <span className="text-blue-500">Checking username availability...</span>
              )}
              {username && usernameAvailable === true && !checkingUsername && (
                <span className="text-green-500">Username available ✅</span>
              )}
              {username && usernameAvailable === false && !checkingUsername && (
                <span className="text-red-500">Username taken ❌</span>
              )}
            </p>
          </div>
        </div>

        {/* Column 2 */}
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
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
        </div>

        {/* Full-width Submit Button */}
        <div className="col-span-1 md:col-span-2">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400"
            disabled={loading || usernameAvailable === false}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </div>
      </form>
    </div>
  );
}
