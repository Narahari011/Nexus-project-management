const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    // Optional: filter by projectId query param e.g. /api/tasks?projectId=123
    const { projectId } = req.query;
    
    let query = {};
    if (projectId) {
      // Verify project exists and belongs to user
      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      if (project.createdBy.toString() !== req.user.id) {
        return res.status(401).json({ message: 'Not authorized for this project' });
      }
      query.projectId = projectId;
    } else {
      // Get all projects owned by user to find their tasks
      const projects = await Project.find({ createdBy: req.user.id }).select('_id');
      const projectIds = projects.map(p => p._id);
      query.projectId = { $in: projectIds };
    }

    const tasks = await Task.find(query)
      .populate('projectId', 'title status')
      .populate('assignedTo', 'name email');

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('projectId')
      .populate('assignedTo', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Ensure user owns the project this task belongs to
    if (task.projectId.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, priority, status, dueDate, assignedTo, projectId } = req.body;

    if (!title || !projectId) {
      return res.status(400).json({ message: 'Please provide title and projectId' });
    }

    // Verify project belongs to user
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to add task to this project' });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      status,
      dueDate,
      assignedTo,
      projectId,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('projectId');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Ensure user owns the project this task belongs to
    if (task.projectId.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('projectId', 'title').populate('assignedTo', 'name');

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('projectId');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Ensure user owns the project this task belongs to
    if (task.projectId.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await task.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};
