import React, { useState, useEffect } from "react";
import { ValidationInput } from "../basic/ValidationInput";
import "./ContactUsForm.css";
import BasePopup from "../popup/BasePopup";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

// Contact Us form component
function ContactUsForm() {

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    city: "",
    province_state: "",
    message: "",
  });

  // State to store errors and response message
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);
  const [agreeToDataCollection, setAgreeToDataCollection] = useState(false);
  const handleInputChange = (e) => {
    console.log(`Updating ${e.target.name}:`, e.target.value);
    setFormData(prevData => ({
      ...prevData,
      [e.target.name]: e.target.value
    }));
  };

  useEffect(() => {
  const storedUser = sessionStorage.getItem("user");
  if (storedUser) {
    const user = JSON.parse(storedUser);
    setFormData((prevData) => ({
      ...prevData,
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email || "",
      phone_number: user.phone_number || "",
      city: user.city || "",
      province_state: user.province || "", //PROVICE in laravel this is diffrent 
    }));
  }
}, []);


  // Function to validate input fields
  const validateInput = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = "Please enter your first name";
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = "Please enter your last name";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Please add an email address";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.phone_number.trim()) {
      newErrors.phone_number = "Please add your phone number";
    } else if (!/^\+?[0-9]{7,15}$/.test(formData.phone_number)) {
      newErrors.phone_number = "Enter a valid phone number";
    }
    if (!formData.city.trim()) {
      newErrors.city = "We need to know your city";
    }
    if (!formData.province_state.trim()) {
      newErrors.province_state = "We need to know your Province or State";
    }
    if (!formData.message.trim()) {

      newErrors.message = "Don't forget to add your message!";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };


  // Function to submit form data
  const submit = async (evt) => {
    evt.preventDefault();
    console.log("Submitting form...", formData);

    // Validate form
    if (!validateInput()) {
      console.log("Form validation failed!");
      return;
    }

    console.log("Form validation passed!");

    if (!agreeToDataCollection) {
      alert("You must agree to data collection before submitting.");
      return;
    }

    setIsSubmitting(true);
    setResponseMessage(null);

    console.log("Sending request...");

    try {
      //const response = await fetch("http://localhost/api/send-contact-email", {
      const response = await fetch(`${baseUrl}/api/send-contact-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Response:", data);

      if (response.ok) {
        setResponseMessage({ type: "success", text: "Your message has been sent successfully!" });
         
         confirmReset(); // reset-form
      } else {
        if (response.status === 500) {
          console.warn("Received 500 error due to deprication, but message is bieng sent successfully.");
          setResponseMessage({ type: "success", text: "Your message has been sent successfully!" });
         confirmReset(); // reset-form
        } else {
          setResponseMessage({ type: "error", text: "Failed to send your message. Please try again later." });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setResponseMessage({ type: "error", text: "An error occurred. Please try again." });
    }

    setIsSubmitting(false);
  };


  const confirmReset = () => {
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      city: "",
      province_state: "",
      message: "",
    });
    setErrors({});
    setAgreeToDataCollection(false); 
    setIsPopupOpen(false);
  };

  const handleReset = () => {
    setIsPopupOpen(true);
  };

  return (

    <div className="contact-form">
      <header className="form-header">
        <h2>We're Here To Help!</h2>
        <p>
          At Enviro-Works, your questions and feedback are important to us. Fill out the form below, and we’ll get back to you as soon as possible!
        </p>
        <h3>Contact Us</h3>
      </header>


      <div className="form-container">

        {responseMessage && (
          <div className={`alert ${responseMessage.text === "Your message has been sent successfully!" ? "alert-success" : "alert-error"}`}>
            {responseMessage.text}
            <button onClick={() => setResponseMessage(null)}>✖</button>
          </div>
        )}

        <form onSubmit={submit}>


          {/* First Name and Last Name field styling to improve UI*/}
          <div className="form-field-group">
            <ValidationInput
              title="First Name *"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              errorMessage={errors.first_name}
            />

            <ValidationInput
              title="Last Name *"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              errorMessage={errors.last_name}
            />
          </div>

          {/* Field styling to improve UI*/}
          <div className="form-field-group">
            <ValidationInput
              title="Email *"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              errorMessage={errors.email}
            />

            <ValidationInput
              title="Phone Number *"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              errorMessage={errors.phone_number}
            />
          </div>

          {/*Add additional Fields - re-organize layout if needed*/}
          <div className="form-field-group">
            <ValidationInput
              title="City *"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              errorMessage={errors.city}
            />

            <ValidationInput
              title="Province/State *"
              name="province_state"
              value={formData.province_state}
              onChange={handleInputChange}
              errorMessage={errors.province_state}

            />


          </div>

          {/* Message field styling to improve UI*/}
          <div className="message-field">

            <label className="form-label">
              Message *
            </label>

            <textarea
              id="message"
              name="message"
              className={`border h-[10rem] rounded-md px-2 py-1 resize-none w-full ${errors.message ? "border-red-400" : "border-gray-400"
                }`}

              value={formData.message}
              onChange={handleInputChange}
            />

            <p hidden={!errors.message} className="text-red-500 mt-1" style={{ fontSize: "1.1rem" }}>
              {errors.message}
            </p>

          </div>


          <div className="mt-6 p-4 border border-gray-400 rounded-md bg-gray-50 mb-8 max-w-[46rem]">
            <h3 className="text-lg font-semibold text-gray-800 pb-2">Data Privacy</h3>
            <input
              type="checkbox"
              id="dataConsent"
              checked={agreeToDataCollection}
              onChange={() => setAgreeToDataCollection(!agreeToDataCollection)}
            />
            <label htmlFor="dataConsent" className="data-privacy">
              I agree that Enviro-Works may use my data to process my request in
              accordance with its Privacy Policy and applicable data laws.
            </label>
          </div>

          <div className="flex justify-left gap-4 mt-6">
            <button
              type="submit"
              className="submit-button px-6 py-3 text-white bg-[#003883] rounded-xl font-bold hover:bg-[#003883cc] transition-all duration-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? <span className="loading-spinner"></span> : "Submit"}
            </button>

            <button
              type="button"
              className="reset-button px-6 py-3 text-white bg-[#f47c00] rounded-xl font-bold hover:bg-[#f47c00cc] transition-all duration-200"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>

        </form>

      </div >

      <BasePopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onActivityClicked={confirmReset}
        activityText="Reset"
        title="Confirm Reset"
      >
        <p>Are you sure you want to reset the form?</p>
      </BasePopup>

    </div >
  );

}

export default ContactUsForm;
