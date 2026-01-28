import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "../css/breadcrumb.css";

/**
 * Breadcrumb Component
 * Provides consistent navigation breadcrumbs across all pages
 *
 * @param {Array} items - Array of breadcrumb items
 * Each item should have: { label: string, path: string (optional) }
 * The last item is automatically treated as the current page (non-clickable)
 */
export default function Breadcrumb({ items }) {
  const navigate = useNavigate();

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isClickable = !isLast && item.path;

        return (
          <span key={index} className="breadcrumb-item">
            {isClickable ? (
              <span
                onClick={() => navigate(item.path)}
                className="breadcrumb-link"
              >
                {item.label}
              </span>
            ) : (
              <span className="breadcrumb-current">{item.label}</span>
            )}
            {!isLast && <span className="breadcrumb-sep">/</span>}
          </span>
        );
      })}
    </div>
  );
}

Breadcrumb.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string,
    })
  ).isRequired,
};
