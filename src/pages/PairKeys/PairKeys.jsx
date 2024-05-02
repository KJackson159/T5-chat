import React, { useState } from "react";
import { db } from "../../firebase";
import "firebase/database";
import { useUserAuth } from "../../context/userAuthContext";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, } from "firebase/firestore";
import btstyle from "../../components/buttonStyle";

const forge = require("node-forge");

export default function PairKeys() {
  const { user } = useUserAuth();
  const [name, setName] = useState("");
  const navigate = useNavigate();
  var pemFiles;

  function createKeysAndCertificate(usernameCert) {
    // Generate an RSA key pair
    console.log("Generating 2048-bit key-pair...");
    var keys = forge.pki.rsa.generateKeyPair({ bits: 2048 });
    // Create a certificate
    console.log("Key-pair created.");
    console.log("Creating self-signed certificate...");
    var cert = forge.pki.createCertificate();

    // Set certificate attributes
    cert.publicKey = keys.publicKey;
    cert.serialNumber = "01";
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(
      cert.validity.notBefore.getFullYear() + 1
    );

    // Set certificate subject
    var attrs = [
      {
        name: "commonName",
        value: usernameCert, //"Name you entered",
      },
      {
        name: "organizationName",
        value: "team5",
      },
    ];
    cert.setSubject(attrs);
    // Set issuer (same as subject for self-signed certificates)
    cert.setIssuer(attrs);

    // Self-sign the certificate with the private key
    cert.sign(keys.privateKey);

    // PEM-format keys and cert
    var pem = {
      privateKey: forge.pki.privateKeyToPem(keys.privateKey),
      publicKey: forge.pki.publicKeyToPem(keys.publicKey),
      certificate: forge.pki.certificateToPem(cert),
      issued: cert.validity.notBefore,
      expires: cert.validity.notAfter
    };
    return pem;
  }

  const handleName = (e) => {
    e.preventDefault();
    //name is used for the certificate
    pemFiles = createKeysAndCertificate(name);

    //For debugging purposes, display the pem files:
    console.log("\nKey-Pair:");
    console.log(pemFiles.privateKey);
    console.log(pemFiles.publicKey);

    console.log("\nCertificate:");
    console.log(pemFiles.certificate);
    uploadCertToDb(pemFiles);
    //upload certificate to database to allow message encryption in chat
    //NOTE: certificate only has public key in it, so private key
    //must be uploaded as a separate file with the certificate.
  };

  async function uploadCertToDb(pemFiles){
    //Object for the user's certificate and pair keys and details of when certificate was signed and when it expires.
    const certObj = {
      userID: user.uid,
      certif: pemFiles.certificate,
      pubKey: pemFiles.publicKey,
      privKey: pemFiles.privateKey,
      issued: pemFiles.issued,
      expires: pemFiles.expires
    }
    try {
      // Upload the self-signed certificate to Firebase
      await setDoc(doc(db, "certs", user.uid), certObj)
      .then((res)=>{
      console.log("Certificate uploaded successfully!");
      navigate("/chat");}); //Navigate back to the chat page
      
    } catch (error) {
      console.error("Error uploading certificate:", error);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    navigate("/chat"); //If user changes their mind, they can go back to chat page
  };

  return (
    <div>
      <form onSubmit={handleName}>
        <div>Enter your name for the certificate</div>
        <textarea
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          type="submit"
          style={btstyle.enableButton}
        >
          Submit and Get Certificate
        </button>
        <button onClick={handleCancel}>Cancel & Return to Chat</button>
      </form>
    </div>
  );
}
