export type OperationType = "Delete" | "Create" | "Update" | "Select"

export interface WhereClauseType {
    type: "where"
    condition: WhereConditionType
}

export type OperatorsType = 'and' | 'or' | 'not' | '=' | '>' | '<' | '>=' | '<='
export type SimpleOperationType = {
    type: string
    value?: string | number | boolean
    string: string | number | boolean
}
export interface WhereConditionType {
    type: 'operator',
    operator: OperatorsType,
    left: SimpleOperationType | WhereClauseType,
    right: SimpleOperationType | WhereClauseType
}
export type ParserResult = {
    operation: OperationType,
    table: { type: string, value: string },
    where: WhereConditionType
}