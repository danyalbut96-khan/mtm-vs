import Link from 'next/link'

interface Doctor {
  id: string
  name: string
  specialization: string
  city: string
  location?: string
  consultation_type: string
  experience?: number
  rating?: number
  profile_pic?: string
  is_available?: boolean
  bio?: string
}

export default function DoctorCard({ doctor }: { doctor: Doctor }) {
  const rating = doctor.rating ?? 4.5
  const stars = Math.round(rating)

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-level-1 hover:shadow-level-2 hover:-translate-y-0.5 transition-all p-md flex flex-col gap-sm">
      <div className="flex items-start gap-sm">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {doctor.profile_pic ? (
            <img src={doctor.profile_pic} alt={doctor.name} className="w-full h-full object-cover" />
          ) : (
            <span className="material-symbols-outlined text-primary text-[32px]">person</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-xs flex-wrap">
            <h3 className="font-headline-md text-on-surface font-semibold truncate">Dr. {doctor.name}</h3>
            {doctor.is_available && (
              <span className="px-xs py-[2px] bg-secondary-container text-on-secondary-container text-[11px] font-bold rounded-full flex items-center gap-[2px]">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block"></span>
                Available
              </span>
            )}
          </div>
          <p className="text-label-sm text-primary font-medium">{doctor.specialization}</p>
          <div className="flex items-center gap-xs text-on-surface-variant text-[13px] mt-[2px]">
            <span className="material-symbols-outlined text-[14px]">location_on</span>
            <span>{doctor.city}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-xs flex-wrap">
        <span className={`px-xs py-[2px] text-[11px] font-bold rounded-full ${
          doctor.consultation_type === 'Online' || doctor.consultation_type === 'Both'
            ? 'bg-primary-fixed text-on-primary-fixed-variant'
            : 'bg-surface-container text-on-surface-variant'
        }`}>
          {doctor.consultation_type === 'Both' ? 'Online & Physical' : doctor.consultation_type}
        </span>
        {doctor.experience && (
          <span className="text-[12px] text-on-surface-variant">{doctor.experience} yrs exp</span>
        )}
      </div>

      <div className="flex items-center gap-xs">
        <div className="flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={`material-symbols-outlined text-[16px] ${i < stars ? 'text-tertiary' : 'text-outline-variant'}`}
              style={{ fontVariationSettings: i < stars ? "'FILL' 1" : "'FILL' 0" }}>
              star
            </span>
          ))}
        </div>
        <span className="text-label-sm text-on-surface-variant">{rating.toFixed(1)}</span>
      </div>

      {doctor.bio && (
        <p className="text-[13px] text-on-surface-variant line-clamp-2">{doctor.bio}</p>
      )}

      <div className="flex gap-sm mt-auto pt-xs">
        <Link
          href={`/doctors/${doctor.id}`}
          className="flex-1 text-center py-xs px-sm bg-primary-container text-on-primary-container rounded-lg text-label-sm font-medium hover:brightness-110 transition-all"
        >
          View Profile
        </Link>
        <Link
          href={`/booking/${doctor.id}`}
          className="flex-1 text-center py-xs px-sm border border-primary text-primary rounded-lg text-label-sm font-medium hover:bg-primary/5 transition-all"
        >
          Book
        </Link>
      </div>
    </div>
  )
}
