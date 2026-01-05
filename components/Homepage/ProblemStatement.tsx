const ProblemStatement = () => {
  const challenges = [
    "Documents have unfamiliar names.",
    "Advice changes depending on who you ask.",
    "One missing paper can block everything—from tax compliance to Mobile Money merchant accounts.",
  ];

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-slate-50">
      <div className="max-w-5xl lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 lg:mb-12">
          The Problem We Name
        </h2>

        <div className="space-y-8 lg:space-y-10 text-center">
          <div className="max-w-3xl mx-auto">
            <p className="text-lg md:text-xl lg:text-2xl text-slate-700 leading-relaxed">
              Running a business in Cameroon shouldn't feel like guessing your way through government offices.
            </p>
            <p className="text-lg md:text-xl lg:text-2xl text-slate-700 font-medium mt-4">
              But for most people, it does.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 py-8 lg:py-12 max-w-5xl mx-auto">
            {challenges.map((challenge, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-5 lg:p-6 shadow-sm border border-slate-200 text-left hover:shadow-md transition-shadow flex flex-col justify-center items-center md:items-start"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="w-3 h-3 rounded-full bg-red-400" />
                  </span>
                  <span className="text-sm font-medium text-red-600 text-center md:text-start">Challenge {index + 1}</span>
                </div>
                <p className="text-base lg:text-lg text-slate-600 leading-relaxed text-center md:text-start">
                  {challenge}
                </p>
              </div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto pt-4 lg:pt-8 space-y-6">
            <p className="text-lg md:text-xl lg:text-2xl text-slate-700 leading-relaxed">
              Most business owners don't fail because they don't want to comply.
            </p>
            <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-slate-900">
              They fail because no one explains the system clearly.
            </p>

            <div className="pt-6 lg:pt-8">
              <p className="text-xl md:text-2xl lg:text-3xl text-primary font-bold">
                That's what we do. This platform helps you start correctly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemStatement;