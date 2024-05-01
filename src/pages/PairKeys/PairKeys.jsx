import React, { useState } from "react";
import firebase from "firebase/app";
import "firebase/database";
import { useUserAuth } from "../../context/userAuthContext";
import { useNavigate } from "react-router-dom";
import btstyle from "../../components/buttonStyle";

const forge = require("node-forge");

export default function PairKeys() {
  const [name, setName] = useState("");
  const [isDisabled, setDisabled] = useState(true);
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
        value: usernameCert, //"Your Name",
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

    setDisabled(false);
    //upload certificate to database to allow message encryption in chat
    //NOTE: certificate only has public key in it, so private key
    //must be uploaded as a separate file with the certificate.
  };

  const uploadCertToDb = async (e) => {
    e.preventDefault();
    const { user } = useUserAuth();
    setDisabled(true);

    try {
      // Upload the self-signed certificate to Firebase
      await firebase.database().ref("certs").push({
        certif: pemFiles.certificate,
        prvKey: pemFiles.privateKey,
        userID: user.uid,
      });
      console.log("Certificate uploaded successfully!");
      //navigate to chat page
      navigate("/chat");
    } catch (error) {
      console.error("Error uploading certificate:", error);
    }
    /*
    uploadCertToDb(myCert, myKey) 
    return (
      <div>
        <h2>Upload Certificate to Database</h2>
        <button onClick={handleUpload}>Enable Encryption</button>
        {uploadStatus && <p>{uploadStatus}</p>}
      </div>
    );*/
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setDisabled(true);
    navigate("/chat");
  };

  return (
    <div>
      <form onSubmit={uploadCertToDb}>
        <div>Enter your name for the certificate</div>
        <textarea
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          onClick={handleName}
          style={!isDisabled ? btstyle.disableButton : btstyle.enableButton}
        >
          Submit Name
        </button>
        <button
          type="submit"
          style={isDisabled ? btstyle.disableButton : btstyle.enableButton}
        >
          Upload Certificate
        </button>
        <button onClick={handleCancel}>Cancel & Return to Chat</button>
      </form>
    </div>
  );
}
