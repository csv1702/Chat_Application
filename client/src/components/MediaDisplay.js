const MediaDisplay = ({ attachments }) => {
  if (!attachments || attachments.length === 0) {
    return null;
  }

  return (
    <div className="mt-2 space-y-2">
      {attachments.map((attachment, idx) => (
        attachment.type === "image" && (
          <a
            key={idx}
            href={attachment.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <img
              src={attachment.url}
              alt={attachment.filename || "Shared image"}
              className="max-w-xs rounded-lg max-h-64 object-cover hover:opacity-80 transition"
            />
          </a>
        )
      ))}
    </div>
  );
};

export default MediaDisplay;
