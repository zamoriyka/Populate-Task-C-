using System;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;

namespace Anna.zamorii_Task3
{
    public class mainClass : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            IPluginExecutionContext context = (IPluginExecutionContext)
            serviceProvider.GetService(typeof(IPluginExecutionContext));

            IOrganizationServiceFactory serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = serviceFactory.CreateOrganizationService(context.UserId);

            if (context.InputParameters.ContainsKey("Target") && context.InputParameters["Target"] is Entity)
            {
                if (context.Stage == 20)
                {
                    Entity entityChild = (Entity)context.InputParameters["Target"];
                    EntityReference entityParentLookup = null;

                    if (entityChild.Attributes.ContainsKey("new_parent"))
                    {
                        entityParentLookup = (EntityReference)entityChild.Attributes["new_parent"];
                    }
                    else
                    {
                        Entity entityChildNew = service.Retrieve(entityChild.LogicalName, entityChild.Id, new ColumnSet("new_parent"));
                        entityParentLookup = (EntityReference)entityChildNew.Attributes["new_parent"];
                    }

                    Entity entityParent = service.Retrieve(entityParentLookup.LogicalName, entityParentLookup.Id, new ColumnSet("new_lastname", "new_amount"));

                    if (entityChild.Attributes.ContainsKey("new_parent"))
                    {
                        entityChild.Attributes["new_parentlastname"] = entityParent.Attributes["new_lastname"];
                    }                  
                   
                }
                else if (context.Stage == 40)
                {
                    Entity entityChild = (Entity)context.InputParameters["Target"];
                    EntityReference entityParentLookup = null;

                    if (entityChild.Attributes.ContainsKey("new_parent"))
                    {
                        entityParentLookup = (EntityReference)entityChild.Attributes["new_parent"];
                    }
                    else
                    {
                        Entity entityChildNew = service.Retrieve(entityChild.LogicalName, entityChild.Id, new ColumnSet("new_parent"));
                        entityParentLookup = (EntityReference)entityChildNew.Attributes["new_parent"];
                    }

                    Entity entityParent = service.Retrieve(entityParentLookup.LogicalName, entityParentLookup.Id, new ColumnSet("new_lastname", "new_amount"));
                    QueryExpression ChildRecords = new QueryExpression
                    {
                        EntityName = entityChild.LogicalName,
                        ColumnSet = new ColumnSet("new_amount"),
                        Criteria = new FilterExpression
                        {
                            Conditions =
                            {
                                new ConditionExpression
                                {
                                    AttributeName = "new_parent",
                                    Operator = ConditionOperator.Equal,
                                    Values = { entityParent.Id }
                                }
                             }
                        }
                    };

                    DataCollection<Entity> entityMultiplyRecords = service.RetrieveMultiple(
                        ChildRecords).Entities;

                    decimal childAmount = 0;

                    foreach (Entity entity in entityMultiplyRecords)
                    {
                        childAmount += ((Money)entity.Attributes["new_amount"]).Value;
                    }

                    // entityParent.Attributes["new_amount"] = new Money(childAmount);
                    ((Money)entityParent.Attributes["new_amount"]).Value = childAmount + ((Money)entityParent.Attributes["new_amount"]).Value;
                    service.Update(entityParent);                   
                }                              
            }
        }
    }
}
