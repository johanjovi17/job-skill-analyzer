export const useSkillMatch = (userSkills, requiredSkills = []) => {
  const missingSkills = requiredSkills.filter(
    (skill) => !userSkills.includes(skill)
  );

  const matchPercent =
    requiredSkills.length === 0
      ? 0
      : ((requiredSkills.length - missingSkills.length) /
          requiredSkills.length) *
        100;

  const getMatchLevel = () => {
    if (matchPercent > 70) return "high";
    if (matchPercent > 40) return "medium";
    return "low";
  };

  return {
    missingSkills,
    matchPercent,
    matchLevel: getMatchLevel(),
  };
};