const formatGroup = (group, choices) => {
  choices = choices.map(c => {
    return {
      id: c._id,
      title: c.title
    };
  });

  group = {
    id: group._id,
    title: group.title,
    choices: choices
  };

  return group;
};

module.exports = formatGroup;
