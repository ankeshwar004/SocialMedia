import { Inngest } from "inngest";
import User from "../Models/User.js";
import Connection from "../Models/Connection.js";
import sendEmail from "../config/nodemailer.js";

export const inngest = new Inngest({ id: "Social-Media" });

// Ingestion function to save user to database

const SaveUserData = inngest.createFunction(
  { id: "Save User Data From Clerk" },
  { event: "clerk/user.created" },
  async (event) => {
    const { id, first_name, last_name, email_addresses, image_url, username } = event.data;
    username = username || email_addresses[0].email_address.split('@')[0];

    const user = await User.findOne({ username });
    if (user) {
      username = username + Math.floor(Math.random() * 1000);
    }

    const newUser = new User({
      _id: id,
      email: email_addresses[0].email_address,
      full_name: `${first_name} ${last_name}`,
      username: username,
      profile_picture: image_url
    });

    await newUser.save();
  }
);


// Ingestion Function to update in databse
const UpdateUserData = inngest.createFunction(
  { id: "Update User Data From Clerk" },
  { event: "clerk/user.updated" },
  async (event) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const updatedUserData = {
      email: email_addresses[0].email_address,
      full_name: `${first_name} ${last_name}`,
      profile_picture: image_url
    }
    await User.findByIdAndUpdate(id, updatedUserData);

  }
);

// Ingestion Function to delete in databse
const DeleteUserData = inngest.createFunction(
  { id: "Delete User Data From Clerk" },
  { event: "clerk/user.deleted" },
  async (event) => {
    const { id } = event.data;
    await User.findByIdAndDelete(id);
  }
);

// Inngest function to send remainder when new connection request is received
const sendConnectionRequestRemainder = inngest.createFunction(
  { id: "Send Connection Request Remainder" },
  { event: "app/connection-request" },

  async ({ event, step }) => {
    const { connectionId } = event.data;
    await step.run('send-connection-request-email', async () => {
      const connection = await Connection.findById(connectionId).populate('from_user_id');
      const subject = 'New Connection Request';
      // 8:01
      const body = `<p>You have a new connection request from ${connection.from_user_id.full_name} (@${connection.from_user_id.username}).</p>`;

      await sendEmail({
        to: connection.to_user_id.email,
        subject,
        body
      })
    })

    const in24hr = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await step.sleepUntil('connection-request-reminder', in24hr);
    await step.run('send-connection-request-reminder-email', async () => {
      const connection = await Connection.findById(connectionId).populate('from_user_id');
      if (connection.status === 'accepted') {
        return { message: 'Connection request already accepted.' };
      }
      const subject = 'New Connection Request';
      const body = `<p>You have a new connection request from ${connection.from_user_id.full_name} (@${connection.from_user_id.username}).</p>`;

      await sendEmail({
        to: connection.to_user_id.email,
        subject,
        body
      })

    })
  })


export const functions = [
  SaveUserData,
  UpdateUserData,
  DeleteUserData,
  sendConnectionRequestRemainder
];