const labels = [
  '!!! LABEL_ERROR !!!',
  'optional',
  'required',
  'repeated'
]
const types = [
  '!!! TYPE_ERROR !!!',
  'double',
  'float',
  'int64',
  'uint64',
  'int32',
  'fixed64',
  'fixed32',
  'bool',
  'string',
  'TYPE_GROUP',
  'TYPE_MESSAGE',
  'bytes',
  'uint32',
  'TYPE_ENUM',
  'sfixed32',
  'sfixed64',
  'sint32',
  'sint64',
]


/*
 * Based on the blog post "iOS微信安装包瘦身" by We Mobile Dev
 * https://cloud.tencent.com/developer/article/1030792
 */
function show_fields(inst, name, log) {
  log(`\n=== Fields for ${name} (${inst.$className}) ===`);

  log(`--- ${name}.$ivars ---`);
  Object.keys(inst.$ivars).forEach(function(v) {
    log(`  $ivars['${v}'] = ${inst.$ivars[v]}`);
  });

  /*
   *  Doesn't work. Casting _ivarValueDict to ObjC.Object crashes WeChat :(
   *
  log("--- ivarValueDict ---");
  const ivarValueDict = new ObjC.Object(inst.$ivars['_ivarValueDict']);
  Object.keys(ivarValueDict).forEach(function(v) {
      log(`  ivarValueDict[${v}] = ${ivarValueDict[v]}`);
  });
  var enumerator = ivarValueDict.keyEnumerator();
  var key;
  while ((key = enumerator.nextObject()) !== null) {
      const value = dict.objectForKey_(key);
      log(`ivarValueDict[${key}] = ${value}`);
  }
  */

  /*
   * struct PBClassInfo {
   *     unsigned int _field1;
   *     char **_field2;
   *     unsigned long long *_field3;
   *     unsigned long long *_field4;
   *     struct *_field5;
   * };
   */
  const classInfo = inst.$ivars['_classInfo']; // PBClassInfo
  const numberOfProperty = classInfo.readUInt();
  log(`--- numberOfProperty = ${numberOfProperty} ---`);

  const propertyNamesBase = classInfo.add(8).readPointer();
  const fieldInfosBase = classInfo.add(32).readPointer();
  for (let i = 0; i < numberOfProperty; i++) {
    const propertyName = propertyNamesBase
      .add(8 * i)
      .readPointer()
      .readUtf8String();
    const fieldNumber = fieldInfosBase
      .add(24 * i)
      .readU8();
    const fieldLabel = fieldInfosBase
      .add(24 * i + 1)
      .readU8();
    const fieldType = fieldInfosBase
      .add(24 * i + 2)
      .readU8();
    const isPacked = fieldInfosBase
      .add(24 * i + 3)
      .readU8();
    const enumInitValue = fieldInfosBase
      .add(24 * i + 4)
      .readUInt();
    log(`  ${labels[fieldLabel]} ${types[fieldType]} ${propertyName}` +
      ` = ${fieldNumber}${isPacked ? ' [packed=true]' : ''};`);
    /*
    log(`  [${propertyName}]`);
    log(`    fieldNumber = ${fieldNumber}`);
    log(`    fieldLabel = ${labels[fieldLabel]}`);
    log(`    fieldType = ${types[fieldType]}`);
    log(`    isPacked = ${isPacked}`);
    log(`    enumInitValue = ${enumInitValue}`);
    */
  }
}