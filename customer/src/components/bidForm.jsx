import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import Swal from "sweetalert2";
import { ThreeDots } from "react-loader-spinner";

const BidForm = ({ category, services }) => {
  const [formData, setFormData] = useState({
    serviceType: "",
    budget: "",
    expiryDate: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const selectedService = services.find(
          (service) => service.name === formData.serviceType
        );
        const payload = {
          service: selectedService._id,
          budget: parseFloat(formData.budget),
          description: formData.description,
          expireDate: new Date(formData.expiryDate).toISOString(),
        };
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/bids`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        Swal.fire("Success", "Bid created successfully", "success").then(() => {
          // Refresh the page after the alert is closed
          window.location.reload();
        });
        setFormData({
          serviceType: "",
          budget: "",
          expiryDate: "",
          description: "",
        });
      } catch (error) {
        Swal.fire("Error", error.response.data.message, "error");
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const validateForm = () => {
    const errors = {};
    const selectedService = services.find(
      (service) => service.name === formData.serviceType
    );

    if (!formData.serviceType) {
      errors.serviceType = "Please select a service";
    }

    if (!formData.budget) {
      errors.budget = "Please enter a budget";
    } else if (
      selectedService &&
      parseFloat(formData.budget) < selectedService.startingPrice
    ) {
      errors.budget = `Budget should be greater than or equal to ${selectedService.startingPrice}`;
    }

    if (!formData.expiryDate) {
      errors.expiryDate = "Please select an expiry date";
    }

    if (!formData.description) {
      errors.description = "Please provide a description";
    }

    return errors;
  };

  const today = new Date().toISOString().split("T")[0];
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateString = minDate.toISOString().split("T")[0];

  return (
    <div className="bg-teal-500 mx-4 sm:mx-20 p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between border-b border-teal-300 pb-4">
        <h2 className="text-xl font-bold text-white">Create your own bid</h2>
      </div>
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:space-x-4 sm:items-center sm:justify-between mt-4">
        <div className="flex items-center space-x-2 bg-white p-2 rounded">
          <IoClose className="text-teal-500" />
          <img
            src="/images/construction-icon.png"
            alt="Construction"
            className="h-6"
          />
          <span className="text-teal-500 font-medium">{category}</span>
        </div>
        <select
          name="serviceType"
          value={formData.serviceType}
          onChange={handleChange}
          className={`flex-grow bg-white p-2 rounded text-black ${
            errors.serviceType ? "border-red-500" : ""
          }`}
        >
          <option value="">Select a service</option>
          {services.map((service) => (
            <option key={service._id} value={service.name}>
              {service.name}
            </option>
          ))}
        </select>
        {errors.serviceType && (
          <span className="text-red-500">{errors.serviceType}</span>
        )}
        <div className="flex-grow">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">$</span>
            </div>
            <input
              type="text"
              name="budget"
              placeholder={
                formData.serviceType
                  ? `Minimum ${
                      services.find(
                        (service) => service.name === formData.serviceType
                      ).startingPrice
                    }`
                  : "Budget"
              }
              value={formData.budget}
              onChange={handleChange}
              className={`w-full bg-white p-2 pl-7 rounded text-black focus:outline-none focus:ring-teal-500 focus:border-teal-500 ${
                errors.budget ? "border-red-500" : ""
              }`}
            />
          </div>
          {errors.budget && <span className="text-red-500">{errors.budget}</span>}
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center">
          <span className="text-white pr-2">Expiry Date</span>
          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            className={`bg-white p-2 rounded text-black focus:outline-none focus:ring-teal-500 focus:border-teal-500 ${
              errors.expiryDate ? "border-red-500" : ""
            }`}
            min={minDateString}
          />
          {errors.expiryDate && (
            <span className="text-red-500">{errors.expiryDate}</span>
          )}
        </div>
      </div>
      <div className="mt-8">
        <label htmlFor="description" className="block text-sm font-medium text-white">
          Describe the bid
        </label>
        <textarea
          name="description"
          id="description"
          rows="4"
          value={formData.description}
          onChange={handleChange}
          className={`w-full bg-white p-2 rounded mt-2 text-black focus:outline-none focus:ring-teal-500 focus:border-teal-500 ${
            errors.description ? "border-red-500" : ""
          }`}
        ></textarea>
        {errors.description && (
          <span className="text-red-500">{errors.description}</span>
        )}
      </div>
      <div className="flex justify-end mt-4">
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={isLoading}
          className="bg-white text-teal-500 py-2 px-4 rounded font-medium flex items-center"
        >
          {isLoading && <ThreeDots color="#4FB8B3" height={20} width={20} />}
          <span className="ml-2">Create a bid</span>
        </button>
      </div>
    </div>
  );
};

export default BidForm;