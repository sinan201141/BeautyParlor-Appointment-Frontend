import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const domain = "http://localhost:5056";

  const [phone, setPhone] = useState("");
  const [data, setData] = useState(null);
  const [form, setForm] = useState({
    name: "",
    date: "",
    time: "",
    service: "",
    specialRequests: "",
  });
  const [action, setAction] = useState("");

  const checkAppointment = async () => {
    try {
      const response = await axios.get(`${domain}/appointments/${phone}`);
      setData(response.data);
      if (response.data.exists) {
        if (response.data.pastAppointment) {
          // If the appointment has passed, show an alert and set the action to 'create'
          toast.warn(
            "Your previous appointment is already expired. You can create a new one.",
            { position: "top-right" }
          );
          setAction("create");
        } else {
          setAction("updateOrDelete");
          toast.success("Appointment found!", { position: "top-right" });
        }
      } else {
        setAction("create");
        toast.info("No appointment found. You can create a new one.", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error checking appointment.", { position: "top-right" });
    }
  };

  const handleCreate = async () => {
    try {
      let temp = await axios.post(`${domain}/appointments`, {
        phone,
        ...form,
      });
      if (temp.data.message)
        toast.error(temp.data.message, { position: "top-right" });
      else
        toast.success("Appointment created successfully!", {
          position: "top-right",
        });
      setData(null);
      setAction("");
    } catch (error) {
      console.error(error);
      toast.error("Error creating appointment.", { position: "top-right" });
    }
  };

  const handleUpdate = async () => {
    try {
      let temp = await axios.put(`${domain}/appointments/${phone}`, {
        ...form,
      });
      if (temp.data.message)
        toast.error(temp.data.message, { position: "top-right" });
      else
        toast.success("Appointment updated successfully!", {
          position: "top-right",
        });
      setData(null);
      setAction("");
    } catch (error) {
      console.error(error);
      toast.error("Error updating appointment.", { position: "top-right" });
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${domain}/appointments/${phone}`);
      toast.success("Appointment deleted successfully!", {
        position: "top-right",
      });
      setData(null);
      setAction("");
    } catch (error) {
      console.error(error);
      toast.error("Error deleting appointment.", { position: "top-right" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Appointment System</h1>
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
        {/* Added Image */}
        <div className="mb-4">
          <img
            src="https://img.freepik.com/premium-photo/beautiful-young-woman-washes-hair-beauty-salon_1301-8130.jpg?w=900"
            alt="Beauty Salon"
            className="w-full h-auto rounded-md mb-4"
          />
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter phone number"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button
            onClick={checkAppointment}
            className="mt-2 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Check Appointment
          </button>
        </div>

        {action === "create" && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Create Appointment</h2>
            <input
              type="text"
              placeholder="Name"
              className="w-full p-2 border border-gray-300 rounded-md mb-2"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded-md mb-2"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />

            <input
              type="time"
              id="time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              required
              placeholder="Select Appointment Time"
              className="block w-full px-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            <select
              className="w-full p-2 border border-gray-300 rounded-md mb-2 mt-2"
              value={form.service}
              onChange={(e) => setForm({ ...form, service: e.target.value })}
            >
              <option value="">Select Service</option>
              <option value="facial">Facial</option>
              <option value="massage">Massage</option>
              <option value="haircut">Haircut</option>
              <option value="manicure">Manicure</option>
            </select>
            <textarea
              placeholder="Any special requests"
              className="w-full p-2 border border-gray-300 rounded-md mb-2"
              value={form.specialRequests}
              onChange={(e) =>
                setForm({ ...form, specialRequests: e.target.value })
              }
            />
            <button
              onClick={handleCreate}
              className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
            >
              Create
            </button>
          </div>
        )}

        {action === "updateOrDelete" && data && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Existing Appointment</h2>
            <p className="mb-2">Name: {data.appointment.name}</p>
            <p className="mb-2">
              Date: {new Date(data.appointment.date).toLocaleDateString()}
            </p>
            <p className="mb-2">Time: {data.appointment.time}</p>
            <p className="mb-2">
              Service:{" "}
              {data.appointment.service[0].toUpperCase() +
                data.appointment.service.slice(1)}
            </p>
            <p className="mb-4">
              Special Requests: {data.appointment.specialRequests}
            </p>

            <h2 className="text-xl font-semibold mb-4">Update Appointment</h2>
            <input
              type="text"
              placeholder="New Name"
              className="w-full p-2 border border-gray-300 rounded-md mb-2"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded-md mb-2"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />

            <input
              type="time"
              id="time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              required
              placeholder="Select Appointment Time"
              className="block w-full px-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            <select
              className="w-full p-2 border border-gray-300 rounded-md mb-2 mt-2"
              value={form.service}
              onChange={(e) => setForm({ ...form, service: e.target.value })}
            >
              <option value="">Select Service</option>
              <option value="facial">Facial</option>
              <option value="massage">Massage</option>
              <option value="haircut">Haircut</option>
              <option value="manicure">Manicure</option>
            </select>
            <textarea
              placeholder="Any special requests"
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
              value={form.specialRequests}
              onChange={(e) =>
                setForm({ ...form, specialRequests: e.target.value })
              }
            />
            <button
              onClick={handleUpdate}
              className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 mb-2"
            >
              Update
            </button>
            <button
              onClick={handleDelete}
              className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default App;
