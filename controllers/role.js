const Role = require("../models/Role")

exports.create = async (req, res) => {
  try {
    const assetStatus = req.body["client.assetstatus"];
    const role = await Role.create({
      role: req.body.role,
      client: assetStatus,
      permitted: req.body.permittedBool
    });

    res.redirect("/roles/?message=role has been created");
  } catch (e) {
    console.log(e);
    return res.status(400).send({ message: e.message });
  }
};

// Find first documents in roles collection
exports.list = async (req, res) => {
    try {
        const roles = await Role.find({});
        res.render("allRoles", { roles: roles})
    } catch (exception) {
        res.status(404).send({message: "Could not find role. Reason: "} + {exception})
    }
}

exports.findAdmin = async (req, res) => {
  try {
      const roles = await Role.find({role: "admin"});
      res.render("admin", { roles: roles})
  } catch (exception) {
      res.status(404).send({message: "Could not find admin roles. Reason: "} + {exception})
  }
}

exports.findController = async (req, res) => {
  try {
      const roles = await Role.find({role: "controller"});
      res.render("controllerRole", { roles: roles})
  } catch (exception) {
      res.status(404).send({message: "Could not find controller roles. Reason: "} + {exception})
  }
}

exports.findPlanner = async (req, res) => {
  try {
      const roles = await Role.find({role: "planner"});
      res.render("planner", { roles: roles})
  } catch (exception) {
      res.status(404).send({message: "Could not find planner roles. Reason: "} + {exception})
  }
}

exports.findMonitoring = async (req, res) => {
  try {
      const roles = await Role.find({role: "monitoring"});
      res.render("monitoring", { roles: roles})
  } catch (exception) {
      res.status(404).send({message: "Could not find planner roles. Reason: "} + {exception})
  }
}


// Update document in roles collection
exports.edit = async (req, res) => {
    const id = req.params.id;
  try {
    const role = await Role.findById(id);
    res.render('updateRole', {
      role: role,
      id: id,
      errors: {}
    });
  } catch (e) {
    console.log(e)
    if (e.errors) {
      res.render('/roles', { errors: e.errors })
      return;
    }
    res.status(404).send({
      message: `Could not edit document ${id}.`,
    });
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;
  try {
    const role = await Role.updateOne({ _id: id }, req.body);
    res.redirect('/roles');
  } catch (e) {
    res.status(404).send({
      message: `could find role ${id}.`,
    });
  }
};


// Delete document from roles collection
exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    await Role.findByIdAndRemove(id);
    res.redirect("/roles");
  } catch (e) {
    res.status(404).send({
      message: `could not delete  record ${id}.`,
    });
  }
};
