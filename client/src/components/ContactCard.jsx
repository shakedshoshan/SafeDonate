import React from 'react';

const ContactCard = ({
  mainTitle = 'יצירת קשר',
  subtitle = 'מידע רשמי',
  phoneNumbers = [],
  website,
  email,
  address,
  isLoading,
  onClose,
  noContactMessage = 'העמותה לא סיפקה אמצעים ליצירת קשר'
}) => {

  const phone1 = phoneNumbers[0] || '';  // First phone number if it exists
  const phone2 = phoneNumbers[1] || '';  // Second phone number if it exists

  // Destructuring contact information from contactInfo prop
  // const { website, email, , address,  } = contactInfo || {};

  // Combine phone numbers if both are provided
  //const fullPhone = phone1 && phone2 ? `${phone1} | ${phone2}` : phone1 || phone2;

  // Check if we have any contact details
  const hasContactDetails = website || email || phone1 || phone2 || address ;

  // Function to ensure website has proper format
  const formatLink = (url) => {
  if (!url) return '';
  return url.startsWith('http') ? url : `https://${url}`;
  };

  return (
  <>
  {/* Overlay backdrop */}
  <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
    {/* Card container */}
    <div 
      className="relative bg-white rounded-xl shadow-md p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto font-sans" 
      dir="rtl"
    >
      {/* Close button positioned absolutely */}
      <button 
        onClick={onClose} 
        className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        aria-label="סגור"
      >
        <svg
          className="w-4 h-4 text-gray-500"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>

      <div className="mb-6">
        <h1 className="text-[#2B4F71] text-2xl font-bold mb-1">{mainTitle}</h1>
        <h2 className="text-gray-600 text-lg">{subtitle}</h2>
      </div>
      
      {/* website section appears first if it exists */}
      
      {isLoading ? (
        <p className="text-gray-500">טוען פרטי קשר...</p>
      ) : hasContactDetails ? (
        <>
          {website && (
            <div className="flex items-center mb-4 gap-3">
              <div className="w-9 h-9 bg-[#45B5AA] rounded-full flex items-center justify-center text-white">🔗</div>
              <a 
                href={formatLink(website)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#45B5AA] hover:text-[#3a9990] transition-colors font-medium"
              >
                לאתר הרשמי
              </a>
            </div>
          )}

          {email && (
            <div className="flex items-center mb-4 gap-3">
              <div className="w-9 h-9 bg-[#45B5AA] rounded-full flex items-center justify-center text-white">
                ✉️
              </div>
              <a href={`mailto:${email}`} className="text-gray-700 hover:text-[#45B5AA] transition-colors">
                {email}
              </a>
            </div>
          )}

          {(phone1 || phone2) && (
            <div className="flex items-center mb-4 gap-3">
              <div className="w-9 h-9 bg-[#45B5AA] rounded-full flex items-center justify-center text-white">
                📞
              </div>
              <a href={`tel:${phone1}`} className="text-gray-700 hover:text-[#45B5AA] transition-colors">
                {phone1}{phone2 && ` | ${phone2}`}
              </a>
            </div>
          )}


          {/* {phoneNumbers && (
            <div className="flex items-center mb-4 gap-3">
              <div className="w-9 h-9 bg-[#45B5AA] rounded-full flex items-center justify-center text-white">
                📞
              </div>
              <a href={`tel:${phone1}`} className="text-gray-700 hover:text-[#45B5AA] transition-colors">
                {phoneNumbers }
              </a>
            </div>
          )} */}

          {address && (
            <div className="flex items-center mb-4 gap-3">
              <div className="w-9 h-9 bg-[#45B5AA] rounded-full flex items-center justify-center text-white p-2">
                🏠
              </div>
              <span className="text-gray-700">
                {address || 'כתובת מלאה לא זמינה'}
              </span>
            </div>
          )}
        </>
      ) : (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
              ℹ️
            </div>
            <span className="text-gray-600 font-medium">שים לב</span>
          </div>
          <p className="text-gray-500 text-sm pr-11">
            {noContactMessage}
          </p>
        </div>
      )}
    </div>
  </div>
  </>
  );
};

export default ContactCard;