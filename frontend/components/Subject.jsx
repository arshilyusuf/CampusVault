export default function Subject({subject}) {
    return (
      <div className="p-6 backdrop-blur-[50px] bg-white/30 mb-4 rounded-lg shadow-lg " style={{backdropFilter: 'blur(50px)'}}>
        <h2 className="text-[var(--color-4)] text-[1.2rem]">{subject.subjectName}</h2>
      </div>
    );
}