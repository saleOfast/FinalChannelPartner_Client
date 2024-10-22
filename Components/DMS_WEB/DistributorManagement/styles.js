export const fileDisplayStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    marginBottom: '10px',
  };
  
  export  const fileNameStyle = {
    flexGrow: 1,
    marginRight: '10px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };
  
  export  const removeButtonStyle = {
    backgroundColor: '#ff4d4d',
    border: 'none',
    color: '#fff',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '16px',
    lineHeight: '1',
    transition: 'background-color 0.3s ease',
  };
  
  export  const removeButtonHoverStyle = {
    ...removeButtonStyle,
    backgroundColor: '#e60000',
  };