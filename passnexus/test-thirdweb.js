import { createThirdwebClient } from "thirdweb";
console.log("Thirdweb imported successfully");
try {
    const client = createThirdwebClient({ clientId: "test" });
    console.log("Client created successfully");
} catch (e) {
    console.error("Error creating client:", e);
}
