import React, { forwardRef } from 'react';

interface VolunteerRole {
  title: string;
  icon: string;
  description: string;
}

const volunteers: VolunteerRole[] = [
  { title: "Registration", icon: "📝", description: "Manage attendee check-ins and registrations" },
  { title: "Media", icon: "📸", description: "Capture moments, manage social media" },
  { title: "Ushering/Protocol", icon: "👋", description: "Guide attendees, VIP management" },
  { title: "Welfare", icon: "❤️", description: "Attendee comfort and support" },
  { title: "Logistics", icon: "🚚", description: "Equipment, setup, and coordination" }
];

const VolunteersGrid = forwardRef<HTMLElement>((props, ref) => {
  return (
    <section ref={ref} id="volunteers" className="py-16 md:py-20 px-6 md:px-12 bg-navy-600">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-gold mb-4 text-center">
          Volunteer Teams
        </h2>
        <p className="text-center text-white/80 mb-8 md:mb-12 max-w-2xl mx-auto">
          Join our dedicated teams and be part of something extraordinary
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 md:gap-6">
          {volunteers.map((role, index) => (
            <div 
              key={index} 
              className="bg-navy-800 rounded-xl p-5 md:p-6 text-center hover:transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl border border-gold/20 group cursor-pointer"
            >
              <div className="text-5xl md:text-6xl mb-3 group-hover:scale-110 transition-transform inline-block">
                {role.icon}
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gold mb-2">{role.title}</h3>
              <p className="text-white/70 text-sm">{role.description}</p>
              <button className="mt-4 text-gold text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                Join Team →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

VolunteersGrid.displayName = 'VolunteersGrid';

export default VolunteersGrid;
