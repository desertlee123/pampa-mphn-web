// src/components/Icons.js
import {
  FiShare2,
  FiMessageCircle,
  FiBookmark,
  FiX,
  FiArrowLeft,
  FiSend
} from "react-icons/fi";

const ICON_SIZE = 24;

export const shareIcon = ({ color }) => <FiShare2 size={ICON_SIZE} color={color} />;
export const messageIcon = ({ color }) => <FiMessageCircle size={ICON_SIZE} color={color} />;
export const saveIcon = ({ color, fill }) => (
  <FiBookmark
    size={ICON_SIZE}
    color={color}
    fill={fill !== 'none' ? fill : 'none'}
  />
);
export const closeIcon = ({ color }) => <FiX size={ICON_SIZE} color={color} />;
export const backIcon = ({ color }) => <FiArrowLeft size={ICON_SIZE} color={color} />;
export const sendIcon = ({ color }) => <FiSend size={ICON_SIZE} color={color} />;
