"use client"
import { FaEdit, FaTrash, FaEye, FaCheck, FaTimes, FaEnvelope, FaUpload,FaFilePdf } from "react-icons/fa"
import { BASE_URL } from "../config"

const TableComponent = ({ columns, data, currentPage, itemsPerPage, actionButtons = [],onEditClick, onDeleteClick, onApprove, onReject }) => {
  // Calculate the items to display based on pagination
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const displayData = data.slice(startIndex, endIndex)
  console.log("Data: ",data)

  // Render action buttons based on the type
  const renderActionButton = (type, item) => {
    switch (type) {
      case "edit":
        return (
          <button
            className="p-1 text-blue-500 hover:text-blue-700"
            title="Edit"
            onClick={() => onEditClick(item) }
          >
            <FaEdit />
          </button>
        )
      case "delete":
        return (
          <button
            className="p-1 text-red-500 hover:text-red-700"
            title="Delete"
            onClick={() => onDeleteClick(item)}
          >
            <FaTrash />
          </button>
        )
      case "view":
        return (
          <button
            className="p-1 text-green-500 hover:text-green-700"
            title="View"
            onClick={() => console.log("View", item)}
          >
            <FaEye />
          </button>
        )
      case "approve":
        return (
          <button
            className="p-1 text-green-500 hover:text-green-700"
            title="Approve"
            onClick={() => onApprove(item)}
          >
            <FaCheck />
          </button>
        )
      case "reject":
        return (
          <button
            className="p-1 text-red-500 hover:text-red-700"
            title="Reject"
            onClick={() => onReject(item)}
          >
            <FaTimes />
          </button>
        )
      case "message":
        return (
          <button
            className="p-1 text-blue-500 hover:text-blue-700"
            title="Message"
            onClick={() => console.log("Message", item)}
          >
            <FaEnvelope />
          </button>
        )
      case "publish":
        return (
          <button
            className="p-1 text-purple-500 hover:text-purple-700"
            title="Publish"
            onClick={() => console.log("Publish", item)}
          >
            <FaUpload />
          </button>
        )
      case "cancel":
        return (
          <button
            className="p-1 text-orange-500 hover:text-orange-700"
            title="Cancel"
            onClick={() => console.log("Cancel", item)}
          >
            <FaTimes />
          </button>
        )
      default:
        return null
    }
  }

  // Render cell content based on column key
  const renderCell = (item, column) => {
    if (column.key === "actions") {
      return (
        <div className="flex space-x-2">
          {actionButtons.map((type) => (
            <span key={type}>{renderActionButton(type, item)}</span>
          ))}
        </div>
      );
    } else if (column.key === "documents") {
      return (
        <div className="flex flex-wrap gap-1">
          {item.documents.map((doc, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md"
              title={doc}
            >
              {doc.split("_")[0]}
              <button className="ml-1 text-blue-500 hover:text-blue-700">
                <FaEye size={12} />
              </button>
            </span>
          ))}
        </div>
      );
    } else if (column.key === "status") {
      let statusClass = "";
      switch (item.status) {
        case "Confirmed":
        case "Verified":
          statusClass = "bg-green-100 text-green-800";
          break;
        case "Pending":
          statusClass = "bg-yellow-100 text-yellow-800";
          break;
        case "Cancelled":
        case "Rejected":
          statusClass = "bg-red-100 text-red-800";
          break;
        case "Draft":
          statusClass = "bg-gray-100 text-gray-800";
          break;
        case "Upcoming":
          statusClass = "bg-blue-100 text-blue-800";
          break;
        case "Completed":
          statusClass = "bg-purple-100 text-purple-800";
          break;
        default:
          statusClass = "bg-gray-100 text-gray-800";
      }
      return <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>{item.status}</span>;
    } else if (column.key === "verification_notes") {
      return (
        item.verification_notes ? (
          <a
            href={`${BASE_URL}${item.verification_notes}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline flex items-center gap-1"
          >
            <FaFilePdf className="text-red-500" />
            View Document
          </a>
        ) : (
          <span>No Document</span>
        )
      );
    }
    return item[column.key];
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayData.length > 0 ? (
              displayData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                      {renderCell(item, column)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

}

export default TableComponent
