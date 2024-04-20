import {
  LockOutlined,
  MailOutlined,
  SafetyOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Checkbox, Form, Input, Row } from "antd";
import axios from "axios";
import React, { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { SERVER_URL } from "../../constants/env";
import Wallet from "../../utils/wallet";
import RegCard from "../component/RegCard";
import openNotification from "../helpers/notification";
import { UserContext } from "../providers/UserProvider";

const wallet = new Wallet();

function AccountReg(props) {
  const [form] = Form.useForm();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState(0);
  const [inviteCode, setInviteCode] = useState(0);
  const [message, setMessage] = useState("");
  const [isValidated, setValidate] = useState(false);
  const [t, i18n] = useTranslation();
  const userData = useContext(UserContext);

  const serverUrl = SERVER_URL;
  const onChange = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };
  const changeState = () => {
    console.log("change");
  };

  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const verifyEmail = () => {
    return axios
      .post(serverUrl + "users/emailverify", {
        email: email,
        locale: localStorage.getItem("locale") || "Mn",
      })
      .then((response) => {
        console.log(response);
        if (response.data.response) {
          openNotification(
            t("Success"),
            t("E-mail sent successfully"),
            true,
            false,
          );
          setMessage({
            style: "text-green-500",
            val: 1,
            data: t("E-mail successfully verified!"),
          });
        } else {
          openNotification(t("Fail!"), t("E-mail not verified!"), false, false);
          setMessage({
            style: "text-red-500",
            val: 0,
            data: t("E-mail not verified!"),
          });
        }
      });
  };
  const register = () => {
    form.validateFields().then((values) => {
      const registerData = {
        email: values.email,
        email_verify: parseInt(values.verification, 10),
        password: values.password,
        confirm_password: values.confirm,
        country: props.country.title,
        invite_code: values.inviteCode,
        locale: localStorage.getItem("locale") || "Mn",
      };
      console.log("registerData", registerData);
      userData.userRegister(registerData);
    });
  };

  const goMain = () => {
    window.location.href = "/walletMain";
  };
  function hasErrors(fieldsError) {
    console.log("errer", fieldsError[0].errors.length);
    if (fieldsError[0].errors.length > 0) return false;
    verifyEmail();
    // return Object.keys(fieldsError).some(field => fieldsError[field]);
  }
  return (
    <RegCard
      className={props.className}
      cardClassName="w-full h-full rounded-none flex flex-col flex-wrap justify-center items-center"
    >
      <Row className="text-xl font-bold py-4 text-gray-900">
        {t("Create MGL Account")}
      </Row>

      <Form
        form={form}
        name="basic"
        initialValues={{ remember: true }}
        autoComplete="off"
        onValuesChange={changeState}
        validateTrigger="onSubmit"
      >
        <Form.Item
          validateTrigger="onBlur"
          name={["email"]}
          rules={[
            { type: "email", message: t("Invalid Email Address") },
            { required: true, message: t("Please input your E-mail!") },
            { max: 50, message: t("Please input less than 50 characters") },
          ]}
        >
          <Input
            placeholder={t("E-mail address")}
            prefix={<MailOutlined className="m-2" />}
            className=" rounded-lg  bg-gray-200 text-black "
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          name="verification"
          rules={[
            {
              required: true,
              message: t("Please input your E-mail Verification Code!"),
            },
            { max: 4, message: t("Please input less than 4 characters") },
            { numeric: true, message: t("Please input numeric characters") },
          ]}
        >
          <Input
            placeholder={t("E-mail verification code")}
            prefix={<SafetyOutlined className="m-2" />}
            suffix={
              <a
                onClick={() => hasErrors(form.getFieldsError())}
                className="bg-gray-800 text-md  text-white  rounded-xl py-1 px-4"
              >
                {t("Send")}
              </a>
            }
            className="rounded-lg  bg-gray-200"
            onChange={(e) => setVerificationCode(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          validateTrigger="onBlur"
          name="password"
          rules={[
            { required: true, message: t("Please input your password!") },
            { min: 8, message: t("Please input more than 8 characters") },
          ]}
        >
          <Input.Password
            placeholder={t("enter password here")}
            prefix={<LockOutlined className="m-2" />}
            className="rounded-lg  bg-gray-200"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          validateTrigger="onChange"
          name="confirm"
          dependencies={["password"]}
          rules={[
            { required: true, message: t("incorrect password!") },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(t("The passwords that you entered do not match!")),
                );
              },
            }),
          ]}
        >
          <Input.Password
            placeholder={t("confirm password")}
            prefix={<LockOutlined className="m-2" />}
            className="rounded-lg  bg-gray-200"
          />
        </Form.Item>

        <Form.Item name="inviteCode" rules={[{ max: 10 }]}>
          <Input
            placeholder={t("Invite Code(Optional)")}
            prefix={<TeamOutlined className="m-2" />}
            className="rounded-lg  bg-gray-200"
            onChange={(e) => setInviteCode(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          name="check"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(new Error(t("Should accept agreement"))),
            },
          ]}
        >
          <Checkbox onChange={onChange}>
            {t("I have read and agree to MGL's Terms of Service")}
          </Checkbox>
        </Form.Item>
        {/*<span className={`${message.style} text-lg`}>{message.val==1?<FcOk className="inline mr-2"/>:message.val==0?<FcCancel className="inline mr-2"/>:null}{message.data}</span>*/}
        <Form.Item className="mt-2">
          <button
            type="submit"
            onClick={register}
            className="w-full bg-gray-800 text-lg font-bold text-white  rounded-lg py-2"
          >
            {t("Create Account")}
          </button>
        </Form.Item>
      </Form>
      <div className="text-center">
        {t("Already registered?")}
        <Link
          to="/login"
          onClick={props.stepLogIn}
          className="myAnchor text-md ml-2"
        >
          {t("Log In")}
        </Link>
      </div>
    </RegCard>
  );
}

export default AccountReg;
