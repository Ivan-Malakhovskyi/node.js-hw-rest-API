const DecoratorMethods = (
  target: any,
  name: string,
  descriptor: PropertyDescriptor
) => {
  console.log(`Method ${name} "${target.constructor.name}" is called`);
};

class MyMethod {
  @DecoratorMethods
  myMethod() {
    console.log("object");
  }
}

let object = new MyMethod();
object.myMethod();

function ValidateString() {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      if (typeof args[0] !== "string") {
        throw new Error("Invalid input. Expected a string.");
      }

      return originalMethod.apply(this, args);
    };
  };
}

class MyClass {
  @ValidateString()
  public print(value: string) {
    console.log(`Received value: ${value}`);
  }
}

const instance = new MyClass();
instance.print("Hello");

function CheckEmail(target: any, methodName: string, position: number) {
  if (!target[methodName].validation) {
    target[methodName].validation = {};
  }
  Object.assign(target[methodName].validation, {
    [position]: (value: string) => {
      if (value.includes("@")) {
        return value;
      }
      throw new Error("No valid field");
    },
  });
}

function Validation(_: any, _2: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value;

  descriptor.value = function (...args: any[]) {
    if (method.validation) {
      args.forEach((item, index) => {
        if (method.validation[index]) {
          args[index] = method.validation[index](item);
        }
      });
    }
    return method.apply(this, args);
  };
}

class Person {
  @Validation
  setEmail(@CheckEmail email: string) {
    console.log(email);
  }
}

const person = new Person();

person.setEmail("test@gmail.com"); // Ok
person.setEmail("testgmail.com"); // No valid field
