def testMethod(param1, param2 = "default"):
    print(f"This is a test method. {param1}, {param2}")
    return "Test successful"

if __name__ == "__main__":
    # Test the testMethod with different parameters
    print(testMethod(42, "Hello"))
    print(testMethod(100))
    print(testMethod(param2="World", param1=99))
    
    # Test with default parameters
    print(testMethod(10))
    
    # Test with only the second parameter
    print(testMethod(param2="Only this one"))
    
    # Test with no parameters (should use defaults)
    print(testMethod(0))