import React from 'react';

const ContactCard = ({ 
  mainTitle = 'יצירת קשר',
  subtitle = 'מידע רשמי',
  phone1 = '',
  phone2 = '',
  email = '',
  address = '',
  cityZip = '',
  link = '',
  linkText = 'לאתר הרשמי',
  noContactMessage = 'פרטי הקשר של הארגון מוצגים בהתאם למידע הרשמי האחרון שהוגש'
}) => {
  // Combine address details if both are provided
  const fullAddress = address && cityZip ? `${address}, ${cityZip}` : address || cityZip;
  
  // Combine phone numbers if both are provided
  const fullPhone = phone1 && phone2 ? `${phone1} | ${phone2}` : phone1 || phone2;

  // Check if we have any contact details
  const hasContactDetails = fullPhone || email;

  // Function to ensure link has proper format
  const formatLink = (url) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `https://${url}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 max-w-md mx-auto font-sans" dir="rtl">
      <div className="mb-6">
        <h1 className="text-[#2B4F71] text-2xl font-bold mb-1">
          {mainTitle}
        </h1>
        <h2 className="text-gray-600 text-lg">
          {subtitle}
        </h2>
      </div>
      
      {/* Link section appears first if it exists */}
      {link && (
        <div className="flex items-center mb-4 gap-3">
          <div className="w-9 h-9 bg-[#45B5AA] rounded-full flex items-center justify-center text-white">
            🔗
          </div>
          <a 
            href={formatLink(link)} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[#45B5AA] hover:text-[#3a9990] transition-colors font-medium"
          >
            {linkText}
          </a>
        </div>
      )}
      
      {hasContactDetails ? (
        <>
          {fullPhone && (
            <div className="flex items-center mb-4 gap-3">
              <div className="w-9 h-9 bg-[#45B5AA] rounded-full flex items-center justify-center text-white">
                📞
              </div>
              <a href={`tel:${phone1}`} className="text-gray-700 hover:text-[#45B5AA] transition-colors">
                {fullPhone}
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

      {/* Address section is always shown */}
      <div className="flex items-center mb-4 gap-3">
        <div className="w-9 h-9 bg-[#45B5AA] rounded-full flex items-center justify-center text-white p-2">
          🏠
        </div>
        <span className="text-gray-700">
          {fullAddress || 'כתובת לא זמינה'}
        </span>
      </div>
    </div>
  );
};

export default ContactCard;