// app/components/AuthInputField.js
"use client";
import { MdEmail, MdLock, MdPerson } from "react-icons/md";
import { useTheme } from "../context/ThemeContext";

export default function AuthInputField({
  label,
  iconName,
  placeholder,
  value,
  onChange,
  type = "text",
  style,
  keyboardType = "default",
  hasError = false
}) {
  const { theme } = useTheme();
  const Icon = iconName === "email" ? MdEmail : iconName === "lock" ? MdLock : MdPerson;

  const getInputType = () => {
    if (type !== "text") return type;
    if (keyboardType === "email-address") return "email";
    return "text";
  };

  return (
    <div style={{ ...styles.fieldContainer, ...style }}>
      <label style={{
        ...styles.label,
        color: hasError ? '#ef4444' : theme.text.primary
      }}>
        {label}
      </label>
      <div style={styles.inputContainer}>
        <Icon
          size={20}
          color={hasError ? '#ef4444' : "#6B7280"}
          style={styles.icon}
        />
        <input
          type={getInputType()}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            ...styles.inputWithIcon,
            backgroundColor: theme.input.background,
            borderColor: hasError ? '#ef4444' : theme.input.border,
            color: theme.text.primary,
          }}
          className="auth-input"
        />
      </div>

      <style jsx>{`
        .auth-input::placeholder {
          color: ${theme.input.placeholder || "#999"};
        }
        
        .auth-input:-ms-input-placeholder {
          color: ${theme.input.placeholder || "#999"};
        }
        
        .auth-input::-ms-input-placeholder {
          color: ${theme.input.placeholder || "#999"};
        }
      `}</style>
    </div>
  );
}

const styles = {
  fieldContainer: {
    marginBottom: 12,
    width: "100%",
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    display: "block",
  },
  inputContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  icon: {
    position: "absolute",
    left: 10,
    zIndex: 1,
  },
  inputWithIcon: {
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 40,
    paddingRight: 12,
    fontSize: 16,
    width: "100%",
    outline: "none",
    boxSizing: "border-box",
    transition: 'border-color 0.2s',
  },
};
