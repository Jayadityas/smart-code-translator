import History from "../models/History.model.js";

export const createHistoryEntry = async (data) => {
  const entry = await History.create(data);
  return entry;
};

//While reading history entries, we implement pagination for faster loading of entries

//In pagination instead of loading one at a time, we load a batch of entries simultaneously
export const getUserHistory = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  /*Promise.all runs both the find query and the countDocuments query in parallel.
   This is faster than running them one after the other. */
  const [entries, totalEntries] = await Promise.all([
    History.find({ userId })
      .sort({ createdAt: -1 }) //sorts by newest first.
      .skip(skip)  //skips entries from previous pages
      .limit(limit) //returns only the requested number
      .select("-__v"),

    History.countDocuments({ userId }),
  ]);

  return {
    entries,
    totalEntries,
    totalPages: Math.ceil(totalEntries / limit),
    currentPage: page,
  };
};

export const getHistoryEntry = async (entryId, userId) => {
  const entry = await History.findOne({
    _id: entryId,
    userId,
  }).select("-__v");

  if (!entry) {
    throw new Error("History entry not found");
  }

  return entry;
};

export const deleteHistoryEntry = async (entryId, userId) => {
  const entry = await History.findOneAndDelete({ _id: entryId, userId });
  if (!entry) throw new Error("History entry not found");
  return entry;
};

export const clearUserHistory = async (userId) => {
  const result = await History.deleteMany({ userId });
  return { deletedCount: result.deletedCount };
};

